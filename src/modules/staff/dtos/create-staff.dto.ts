import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreateStaffDto {
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    first_name: string

    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    last_name: string

    @IsString()
    @IsNotEmpty()
    phone: string

    @IsString()
    @IsNotEmpty()
    position: string

    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    salary: number

    @IsString()
    @IsNotEmpty()
    hire_date: string

    @IsString()
    @IsOptional()
    address: string
}
