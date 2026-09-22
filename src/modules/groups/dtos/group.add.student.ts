import { IsArray, IsMongoId, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class addStudentGroup{
    @IsArray()
    @IsMongoId({ each: true })
    @IsOptional()
    students: Types.ObjectId[];
}