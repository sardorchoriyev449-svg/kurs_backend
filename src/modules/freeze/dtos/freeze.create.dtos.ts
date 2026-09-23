import { IsMongoId, IsNotEmpty } from "class-validator"

export class FreezeCreateDtos{
    @IsMongoId()
    @IsNotEmpty()
    group:string

    @IsMongoId()
    @IsNotEmpty()
    student:string
}
