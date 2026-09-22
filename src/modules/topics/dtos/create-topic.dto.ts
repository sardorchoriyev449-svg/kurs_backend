import { IsInt, IsMongoId, IsNotEmpty, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreateTopicDto {
    @IsMongoId()
    @IsNotEmpty()
    course_id: string

    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    name: string

    // Kiritilmasa, service o'zi shu kursdagi keyingi tartib raqamini beradi
    @IsInt()
    @Min(0)
    @IsOptional()
    order: number
}
