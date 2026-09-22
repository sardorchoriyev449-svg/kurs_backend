import {IsNotEmpty, IsString, MinLength} from 'class-validator'

export class SignInDtos{

    @IsNotEmpty()
    @MinLength(6)
    @IsString()
    login:string
    
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password:string
    
}