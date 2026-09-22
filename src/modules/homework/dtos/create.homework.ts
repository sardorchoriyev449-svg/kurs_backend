import { IsOptional, IsString } from "class-validator"

// ESLATMA: student_id (req.user.id'dan) va lesson_id (URL parametridan)
// controller/service tomonidan avtomatik olinadi, shuning uchun bu yerda
// talab qilinmaydi - shart bo'lmagan holda talabalarni chalkashtirib
// qo'ygan edi (avval @IsNotEmpty bo'lgan, lekin baribir ishlatilmasdi).
export class HomeworkCreateDtos{
    @IsString()
    @IsOptional()
    file_name:string

    @IsOptional()
    @IsString()
    description:string
}
