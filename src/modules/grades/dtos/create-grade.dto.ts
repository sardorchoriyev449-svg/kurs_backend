import { IsInt, IsMongoId, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateGradeDto {
    @IsMongoId()
    @IsNotEmpty()
    student_id: string

    @IsMongoId()
    @IsNotEmpty()
    lesson_id: string

    @IsInt()
    @Min(0)
    @Max(100)
    @IsNotEmpty()
    score: number

    @IsString()
    @IsOptional()
    comment: string
}
