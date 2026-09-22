import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";

@Schema({collection:'course', timestamps:true, versionKey:false})
export class Course{
    @Prop({type:SchemaTypes.String, required:true})
    name:string

    @Prop({type:SchemaTypes.Number, required:true})
    price:number

    @Prop({type:SchemaTypes.String, required:true})
    description:string
}

export const CourseSchema = SchemaFactory.createForClass(Course)