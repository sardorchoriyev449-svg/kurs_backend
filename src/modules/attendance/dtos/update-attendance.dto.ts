import { IsEnum, IsOptional } from "class-validator";
import { AttendanceStatus } from "../attendance-status.enum";

export class UpdateAttendanceDto {
    @IsEnum(AttendanceStatus)
    @IsOptional()
    status: AttendanceStatus
}
