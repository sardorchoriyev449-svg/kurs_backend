import { IsOptional, IsString } from "class-validator"

export class UserProfileUpdateDtos {

    @IsString()
    @IsOptional()
    first_name:string

    @IsString()
    @IsOptional()
    last_name:string

    @IsString()
    @IsOptional()
    avatar:string

}
