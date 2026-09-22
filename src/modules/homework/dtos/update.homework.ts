import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator"
import { HomeworkStatus } from "../homework-status.enum"

export class HomeworkUpdateDtos{
    @IsString()
    @IsOptional()
    file_name:string
    
    @IsOptional()
    @IsString()
    description:string

    // Faqat o'qituvchi/admin to'ldiradi - talaba o'zining vazifasini tekshirolmaydi
    @IsOptional()
    @IsEnum(HomeworkStatus)
    status:HomeworkStatus

    @IsOptional()
    @IsString()
    teacher_comment:string

    // Ball (0-100) - shunga qarab coin avtomatik hisoblanadi (min 5, max 50)
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(100)
    score:number
}
