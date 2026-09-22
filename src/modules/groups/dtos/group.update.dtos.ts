import { IsArray, IsString, IsMongoId, IsOptional, MinLength } from "class-validator";
import { Types } from "mongoose";

export class GroupUpdateDtos {
  @IsString()
  @MinLength(5)
  @IsOptional()
  name: string;
  
  @IsString()
  @IsOptional()
  lesson_time: string;
  
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  lesson_days: string[];
  
  @IsMongoId()
  @IsOptional()
  teacher: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  course_id: Types.ObjectId;
}
