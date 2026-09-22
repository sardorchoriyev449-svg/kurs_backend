import { IsInt, IsMongoId, IsNotEmpty, IsString, NotEquals } from "class-validator";

export class CreateCoinDto {
    @IsMongoId()
    @IsNotEmpty()
    student_id: string

    // manfiy son ham bo'lishi mumkin (coin ayirish uchun)
    @IsInt()
    @NotEquals(0)
    @IsNotEmpty()
    amount: number

    @IsString()
    @IsNotEmpty()
    reason: string
}
