import { IsOptional, IsString, MinLength } from "class-validator"

export class UserUpdateDtos {

    @IsString()
    @IsOptional()
    first_name:string

    @IsString()
    @IsOptional()
    last_name:string

    @IsString()
    @IsOptional()
    data_both:string

    @IsString()
    @IsOptional()
    @MinLength(6)
    login:string

    @IsString()
    @IsOptional()
    @MinLength(8)
    password:string

    @IsString()
    @IsOptional()
    avatar:string

}