import { IsEnum, IsMongoId, IsNotEmpty } from "class-validator";
import { AttendanceStatus } from "../attendance-status.enum";

export class CreateAttendanceDto {
    @IsMongoId()
    @IsNotEmpty()
    lesson_id: string

    @IsMongoId()
    @IsNotEmpty()
    student_id: string

    @IsEnum(AttendanceStatus)
    @IsNotEmpty()
    status: AttendanceStatus
}
