import { IsEnum } from "class-validator";
import { UserRoles } from "../../../common/guards/user-roles.guard";

export class UserRoleUpdateDtos{

    @IsEnum(UserRoles)
    role:UserRoles
    
}