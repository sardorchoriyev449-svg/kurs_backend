import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsEnum, IsMongoId, IsNotEmpty, ValidateNested } from "class-validator";
import { AttendanceStatus } from "../attendance-status.enum";

export class AttendanceRecordDto {
    @IsMongoId()
    @IsNotEmpty()
    student_id: string

    @IsEnum(AttendanceStatus)
    @IsNotEmpty()
    status: AttendanceStatus
}

export class BulkAttendanceDto {
    @IsMongoId()
    @IsNotEmpty()
    lesson_id: string

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => AttendanceRecordDto)
    records: AttendanceRecordDto[]
}
