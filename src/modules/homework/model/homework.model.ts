import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { Users } from "../../users/model/user.model";
import { HomeworkAssignment } from "../../homework-assignments/model/homework-assignment.model";
import { HomeworkStatus } from "../homework-status.enum";

// Bu - talabaning uy vazifasiga yuborgan JAVOBI (submission).
// O'qituvchi bergan topshiriq alohida "HomeworkAssignment" kolleksiyasida.
@Schema({collection:'homework', timestamps:true, versionKey:false})
export class Homework{
    @Prop({type:SchemaTypes.String})
    file_name:string

    @Prop({type:SchemaTypes.String})
    description:string
    
    @Prop({type:SchemaTypes.ObjectId, ref:Users.name, required:true})
    student_id:Types.ObjectId

    @Prop({type:SchemaTypes.ObjectId, ref:HomeworkAssignment.name, required:true})
    assignment_id:Types.ObjectId

    // O'qituvchi uy vazifasini tekshirib, holatini belgilaydi
    @Prop({type:SchemaTypes.String, enum:HomeworkStatus, default:HomeworkStatus.pending, required:true})
    status:HomeworkStatus

    @Prop({type:SchemaTypes.String, required:false})
    teacher_comment:string

    @Prop({type:SchemaTypes.ObjectId, ref:Users.name, required:false})
    reviewed_by:Types.ObjectId

    // O'qituvchi qo'ygan ball (0-100). Shu ball asosida coin avtomatik hisoblanadi.
    @Prop({type:SchemaTypes.Number, required:false, min:0, max:100})
    score:number

    // Coin faqat bir marta berilishi uchun (qayta tekshirilganda ikki marta berilib ketmasin)
    @Prop({type:SchemaTypes.Boolean, default:false, required:true})
    coin_awarded:boolean
}

export const HomeworkSchema = SchemaFactory.createForClass(Homework)
