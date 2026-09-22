import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateGiftDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsInt()
    @Min(0)
    @IsNotEmpty()
    price_coin: number

    @IsInt()
    @Min(0)
    @IsNotEmpty()
    stock: number

    @IsString()
    @IsOptional()
    description: string

    @IsString()
    @IsOptional()
    image: string
}
