import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { Users } from "../../users/model/user.model";
import { Lesson } from "../../lessons/model/lesson.model";
import { AttendanceStatus } from "../attendance-status.enum";

@Schema({ collection: 'attendance', timestamps: true, versionKey: false })
export class Attendance {
    @Prop({ type: SchemaTypes.ObjectId, ref: Lesson.name, required: true })
    lesson_id: Types.ObjectId

    @Prop({ type: SchemaTypes.ObjectId, ref: Users.name, required: true })
    student_id: Types.ObjectId

    @Prop({ type: SchemaTypes.String, enum: AttendanceStatus, default: AttendanceStatus.kelmadi, required: true })
    status: AttendanceStatus

    @Prop({ type: SchemaTypes.ObjectId, ref: Users.name, required: true })
    marked_by: Types.ObjectId

    // "Keldi" uchun coin faqat BIR MARTA beriladi - holat keyinchalik
    // o'zgartirilsa/qaytarilsa ham qayta berilmasligi uchun shu belgi bilan
    // kuzatiladi ("kelmadi"<->"keldi" almashtirib coin farm qilishning oldini olish).
    @Prop({ type: SchemaTypes.Boolean, default: false })
    coin_awarded: boolean
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance)
