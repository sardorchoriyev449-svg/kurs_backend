import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { SchemaTypes, Types } from "mongoose"
import { Users } from "../../users/model/user.model"
import { Course } from "../../course/model/course.model"

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
    @Prop({type:[{type:SchemaTypes.ObjectId, ref:Users.name}], default:[]})
    suspended_students:Types.ObjectId[]
}

export const GroupSchema = SchemaFactory.createForClass(Group)