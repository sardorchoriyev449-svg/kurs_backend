import { IsArray, IsNotEmpty, IsString, IsMongoId, IsOptional, MinLength } from "class-validator";
import { Types } from "mongoose";

export class GroupCreateDto {
  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  name: string;
    
  @IsString()
  @IsNotEmpty()
  lesson_time: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  lesson_days: string[];

  @IsMongoId()
  @IsOptional()
  teacher: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  course_id: Types.ObjectId
}
