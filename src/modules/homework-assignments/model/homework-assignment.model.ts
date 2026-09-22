import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { Group } from "../../groups/model/group.model";
import { Topic } from "../../topics/model/topic.model";
import { Users } from "../../users/model/user.model";

// Uy vazifasi topshirig'i - o'qituvchi guruhga beradigan topshiriq.
// Talabalar javobi (fayl) alohida "Homework" (submission) sifatida,
// shu topshiriqqa (assignment_id) bog'langan holda saqlanadi.
@Schema({ collection: 'homework_assignment', timestamps: true, versionKey: false })
export class HomeworkAssignment {
    @Prop({ type: SchemaTypes.ObjectId, ref: Group.name, required: true })
    group_id: Types.ObjectId

    // Mavzular ro'yxatidan tanlansa shu yerga yoziladi (ixtiyoriy)
    @Prop({ type: SchemaTypes.ObjectId, ref: Topic.name, required: false })
    topic_id: Types.ObjectId

    @Prop({ type: SchemaTypes.String, required: true })
    title: string

    @Prop({ type: SchemaTypes.String, required: true })
    description: string

    // O'qituvchi namuna sifatida biriktirgan fayl (ixtiyoriy, zip ham bo'lishi mumkin)
    @Prop({ type: SchemaTypes.String, required: false })
    attachment: string

    @Prop({ type: SchemaTypes.Date, required: false })
    due_date: Date

    @Prop({ type: SchemaTypes.ObjectId, ref: Users.name, required: true })
    created_by: Types.ObjectId
}

export const HomeworkAssignmentSchema = SchemaFactory.createForClass(HomeworkAssignment)
