import {IsNotEmpty, IsOptional, IsString, MaxLength, MinLength} from 'class-validator'

export class CreateUserDtos{

    @IsNotEmpty()
    @MinLength(3)
    @IsString()
    first_name:string
    
    @IsNotEmpty()
    @MinLength(3)
    @IsString()
    last_name:string

    @IsNotEmpty()
    @MinLength(9)
    @MaxLength(9)
    @IsString()
    phone:string
    
    @IsNotEmpty()
    @IsString()
    data_both:string

    @IsNotEmpty()
    @MinLength(8)
    @IsString()
    password:string
    
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    login:string

}