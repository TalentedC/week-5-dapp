import { ApiProperty } from "@nestjs/swagger";
import { ethers } from "ethers";


export class MintTokenDto {
    @ApiProperty({type: String, required: true, default:"0x87D3683Ef736A7a617adf306D96A9520194C4621"})
    address: string;
    @ApiProperty({ type: String, required: true, default: parseInt("10000000000000000000")})
    mintAmount: BigInt;

}