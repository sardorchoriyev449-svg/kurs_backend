import { IsDateString, IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateAssignmentDto {
    @IsMongoId()
    @IsNotEmpty()
    group_id: string

    @IsMongoId()
    @IsOptional()
    topic_id?: string

    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsString()
    @IsOptional()
    attachment?: string

    @IsDateString()
    @IsOptional()
    due_date?: string
}
