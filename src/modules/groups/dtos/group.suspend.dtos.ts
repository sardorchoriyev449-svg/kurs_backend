import { IsBoolean } from "class-validator";

export class GroupSuspendStudentDtos{
    @IsBoolean()
    suspended: boolean;
}
