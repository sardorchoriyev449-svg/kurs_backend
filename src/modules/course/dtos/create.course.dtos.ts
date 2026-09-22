import { IsInt, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class CoursCreateDtos{
    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    name:string
    
    @IsNumber()
    @IsNotEmpty()
    price:number
    
    @IsString()
    @IsNotEmpty()
    description:string
}