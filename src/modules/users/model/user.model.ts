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

    @Prop({type:SchemaTypes.String, required:false})
    avatar:string

    // Telegram bot orqali login qilgandan keyin shu chat ID saqlanadi -
    // shundan keyin bot shu foydalanuvchini tanib, roliga mos buyruqlarni beradi.
    @Prop({type:SchemaTypes.String, required:false})
    telegram_chat_id:string

}

export const UserSchema = SchemaFactory.createForClass(Users)