import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";
import { UserRoles } from "../../../common/guards/user-roles.guard";

@Schema({collection:'users', timestamps:true, versionKey:false})
export class Users{

    @Prop({type:SchemaTypes.String, required:true})
    first_name:string

    @Prop({type:SchemaTypes.String, required:true})
    last_name:string
    
    @Prop({type:SchemaTypes.String, required:true})
    data_both:string

    @Prop({type:SchemaTypes.String, required:true})
    phone:string
    
    @Prop({type:SchemaTypes.String, required:true})
    password:string

    @Prop({type:SchemaTypes.String, required:true})
    login:string

    @Prop({type:SchemaTypes.String, enum:UserRoles, default:UserRoles.viwer})
    role:UserRoles

}

export const UserSchema = SchemaFactory.createForClass(Users)