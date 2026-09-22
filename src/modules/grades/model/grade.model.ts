import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { Users } from "../../users/model/user.model";
import { Lesson } from "../../lessons/model/lesson.model";

@Schema({ collection: 'grade', timestamps: true, versionKey: false })
export class Grade {
    @Prop({ type: SchemaTypes.ObjectId, ref: Users.name, required: true })
    student_id: Types.ObjectId

    @Prop({ type: SchemaTypes.ObjectId, ref: Lesson.name, required: true })
    lesson_id: Types.ObjectId

    @Prop({ type: SchemaTypes.Number, required: true, min: 0, max: 100 })
    score: number

    @Prop({ type: SchemaTypes.String, required: false })
    comment: string

    @Prop({ type: SchemaTypes.ObjectId, ref: Users.name, required: true })
    graded_by: Types.ObjectId
}

export const GradeSchema = SchemaFactory.createForClass(Grade)
