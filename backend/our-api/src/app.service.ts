import { Injectable } from '@nestjs/common';
import {ethers} from 'ethers';
import * as tokenJson from './assets/MyToken.json';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {

  contract: ethers.Contract;
  provider: ethers.Provider;
  wallet: ethers.Wallet;

  constructor(private configService: ConfigService) {
    this.provider = new ethers.JsonRpcProvider(
      this.configService.get<string>('RPC_ENDPOINT_URL'),
    );
    this.wallet = new ethers.Wallet(
      this.configService.get<string>('PRIVATE_KEY'),
      this.provider,
    );
    this.contract = new ethers.Contract(
      this.configService.get<string>('TOKEN_ADDRESS'),
      tokenJson.abi,
      this.wallet,
    );
  }

  getHello(): string {
    return 'Hello There';
  }
  
  getSomethingElse(): string {
    return 'Something Else';
  }
  getContractAddress(): string {
    return this.configService.get<string>('TOKEN_ADDRESS');
  }

  async getTokenName(): Promise<string> {
    const name = await this.contract.name();
    return name;
  }

  async getTotalSupply() {
  const totalSupply = await this.contract.totalSupply();
  return ethers.formatUnits(totalSupply);
}

  async getTokenBalance(address:string) {
  const balance = await this.contract.balanceOf(address);
  return ethers.formatUnits(balance);

}

async getTransactionReceipt(hash: string) {
  const txReceipt = await this.provider.getTransactionReceipt(hash);
  return txReceipt;
  
}

getServerWalletAddress() {
  return this.wallet.address;
}
async checkMinterRole(address: string) {
const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
console.log(MINTER_ROLE);
const  hasRole = await this.contract.hasRole(MINTER_ROLE, address);
return hasRole;
}

async mintTokens(address: string, mintAmount: BigInt): Promise<string> {
  const balanceBN = await this.provider.getBalance(this.wallet.address);
  const balance = Number(ethers.formatUnits(balanceBN));

  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }
  // Minting tokens
  const tx = await this.contract.mint(address, mintAmount);
  const receipt = await tx.wait();

  return `Transaction completed ${receipt?.hash}`;
}

}