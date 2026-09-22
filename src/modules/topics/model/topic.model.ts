import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { Course } from "../../course/model/course.model";
import { Users } from "../../users/model/user.model";

@Schema({ collection: 'topic', timestamps: true, versionKey: false })
export class Topic {
    @Prop({ type: SchemaTypes.ObjectId, ref: Course.name, required: true })
    course_id: Types.ObjectId

    @Prop({ type: SchemaTypes.String, required: true })
    name: string

    @Prop({ type: SchemaTypes.Number, required: true, default: 0 })
    order: number

    @Prop({ type: SchemaTypes.ObjectId, ref: Users.name, required: false })
    created_by: Types.ObjectId
}

export const TopicSchema = SchemaFactory.createForClass(Topic)
