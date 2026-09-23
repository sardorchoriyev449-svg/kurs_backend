import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { SchemaTypes, Types } from "mongoose"
import { Users } from "../../users/model/user.model"
import { Group } from "../../groups/model/group.model"

// To'lov qilmagani uchun bir talabani bitta guruh doirasida vaqtincha
// muzlatish yozuvi. Yozuv mavjudligi = shu talaba shu guruhda hozir
// muzlatilgan degani; faollashtirilganda yozuv butunlay o'chiriladi.
@Schema({collection:'freeze', timestamps:true, versionKey:false})
export class Freeze{
    @Prop({type:SchemaTypes.ObjectId, ref:Group.name, required:true})
    group:Types.ObjectId

    @Prop({type:SchemaTypes.ObjectId, ref:Users.name, required:true})
    student:Types.ObjectId

    // Muzlatilgan aniq payt - shu vaqtgacha yaratilgan darslar/vazifalar
    // talabaga ko'rinishda qoladi, shu vaqtdan keyingilar ko'rinmaydi.
    @Prop({type:SchemaTypes.Date, required:true})
    suspended_at:Date
}

export const FreezeSchema = SchemaFactory.createForClass(Freeze)
FreezeSchema.index({group:1, student:1}, {unique:true})
