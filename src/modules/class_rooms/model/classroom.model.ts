import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types, Document } from "mongoose";
import { Group } from "../../groups/model/group.model";

export type ClassRoomDocument = ClassRoom & Document;

@Schema({ collection: 'class-room', timestamps: true, versionKey: false })
export class ClassRoom {
    @Prop({ type: SchemaTypes.String, required: true, unique: true })
    name: string;
    
    @Prop({ type: SchemaTypes.Number, required: true })
    size: number;

    @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: Group.name }], default: [] })
    group_id: Types.ObjectId[];
}

export const ClassRoomSchema = SchemaFactory.createForClass(ClassRoom);