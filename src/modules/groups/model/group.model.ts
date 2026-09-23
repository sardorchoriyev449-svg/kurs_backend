import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { SchemaTypes, Types } from "mongoose"
import { Users } from "../../users/model/user.model"
import { Course } from "../../course/model/course.model"

// Talaba qaysi payt (aniq vaqt bilan) muzlatilgani - shu vaqtgacha yaratilgan
// darslar/vazifalar ko'rinishda qoladi, shu vaqtdan keyin qo'shilganlari
// muzlatilgan talabaga ko'rinmay qoladi (to'lov qilingan davr uchun kirish saqlanadi).
@Schema({_id:false})
export class SuspendedStudent{
    @Prop({type:SchemaTypes.ObjectId, ref:Users.name, required:true})
    student:Types.ObjectId

    @Prop({type:SchemaTypes.Date, required:true})
    suspended_at:Date
}
export const SuspendedStudentSchema = SchemaFactory.createForClass(SuspendedStudent)

@Schema({collection:'group', timestamps:true, versionKey:false})
export class Group{
    @Prop({type:SchemaTypes.String, required:true})
    name:string

    @Prop({type:SchemaTypes.String, required:true})
    lesson_time:string

    @Prop({type:SchemaTypes.ObjectId, ref:Users.name})
    teacher:Types.ObjectId

    @Prop({type:[{type:SchemaTypes.ObjectId, ref:Users.name}]})
    students:Types.ObjectId[]

    @Prop({type:[{type: SchemaTypes.String}], required:true})
    lesson_days:string[]

    @Prop({type:SchemaTypes.ObjectId, ref:Course.name})
    course_id: Types.ObjectId

    // To'lov qilmagani uchun vaqtincha muzlatilgan o'quvchilar (shu guruh doirasida)
    @Prop({type:[SuspendedStudentSchema], default:[]})
    suspended_students:SuspendedStudent[]
}

export const GroupSchema = SchemaFactory.createForClass(Group)