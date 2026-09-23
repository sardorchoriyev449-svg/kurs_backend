import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Users } from "./model/user.model";
import { Model, ObjectId, Types } from "mongoose";
import { CreateUserDtos } from "./dtos/user.create.dtos";
import bcrypt from "bcrypt"
import { UserRoles } from "../../common/guards/user-roles.guard";
import { UserUpdateDtos } from "./dtos/users.update.dtos";
import { UserRoleUpdateDtos } from "./dtos/user.role.update.dtos";
import { UserProfileUpdateDtos } from "./dtos/user.profile.update.dtos";

@Injectable()
export class UsersService{
    constructor(
        @InjectModel(Users.name) private readonly model:Model<Users>,
    ){}

    async getAll(){
        const data = await this.model.find()
        return {
            success:true,
            data:data,
        }
    }

    async getOne(id:Types.ObjectId | string){
        const data = await this.model.findOne({_id:id})

        if(!data) return {success:false, message:`Bunaqa Malumot Yoq!`}

        return {
            success:true,
            data:data,
        }
    }

    async create(dtos:CreateUserDtos){
        const user = await this.model.findOne({login:dtos.login})
        if(user) return {success:false, message:`Bunaqa login mavjut!`}

        const phone = `+998${dtos.phone}`

        const heshPass = await this.hashpass(dtos.password)

        const both = dtos.data_both

        console.log(both);
        
        await this.model.create({
            ...dtos,
            phone:phone,
            password:heshPass,
            data_both:both,
            role:UserRoles.viwer,
        })
        return {
            success:true,
            message:`User mufaqayatliy yaratildi!`,
        }
    }

    async delete(id:ObjectId){
        const data = await this.model.findOne({_id:id})

        if(!data) return {success:false, message:`Bunaqa Malumot Yoq!`}

        await this.model.findByIdAndDelete({_id:id})

        return {
            success:true,
            message:`Malumot Tozalandi!`,
        }
    }

    async update(dtos:UserUpdateDtos, id:ObjectId, requesterRole?:string){
        const user = await this.model.findById(id)
        if(!user) return {success:false, message:`Bunaqa Malumot Yoq!`}

        if(user.role === UserRoles.superAdmin && requesterRole !== UserRoles.superAdmin){
            return {success:false, message:`Faqat super admin buni o'zgartira oladi!`}
        }

        if(dtos.login && dtos.login !== user.login){
            const exists = await this.model.findOne({login:dtos.login, _id:{$ne:id}})
            if(exists) return {success:false, message:`Bunaqa login mavjut!`}
        }

        const password = dtos.password ? await this.hashpass(dtos.password) : user.password

        await this.model.findByIdAndUpdate(id,{
            first_name:dtos.first_name ?? user.first_name,
            last_name:dtos.last_name ?? user.last_name,
            data_both:dtos.data_both ?? user.data_both,
            login:dtos.login ?? user.login,
            password:password,
            avatar:dtos.avatar ?? user.avatar,
        })
        return {
            success:true,
            message:`User mufaqayatliy yangilandi!`,
        }
    }

    async updateMe(dtos:UserProfileUpdateDtos, id:string){
        const user = await this.model.findById(id)
        if(!user) return {success:false, message:`Bunaqa Malumot Yoq!`}

        await this.model.findByIdAndUpdate(id,{
            first_name:dtos.first_name ?? user.first_name,
            last_name:dtos.last_name ?? user.last_name,
            avatar:dtos.avatar ?? user.avatar,
        })
        return {
            success:true,
            message:`Profil muvaffaqiyatli yangilandi!`,
        }
    }

    async roleUpdate(id: string, dto: UserRoleUpdateDtos, currentUserId: string) {
        if (String(id) === String(currentUserId)) {
            return { success:false, message:`O'zingizning rolingizni o'zgartira olmaysiz!` };
        }

        const user = await this.model.findById(id);
        if (!user) return { success:false, message:`Bunaqa Malumot Yoq!` };
        if (user.role === UserRoles.superAdmin) return { success:false, message:`Yoq mumkin mas!!!` };
        if (user.role === UserRoles.admin) return { success:false, message:`Admin O'zgarmaydi!` };

        await this.model.findByIdAndUpdate(id, {
            role: dto.role ?? user.role,
        });
        return { success:true, message: "Rol yangilandi" };
    }
    async getAllStudents(){
        const data = await this.model.find({role:UserRoles.student})
        return {
            success:true,
            length:data.length,
            data:data,
        }
    }

    // Telegram bot login oqimi uchun: login/parolni tekshiradi, to'g'ri bo'lsa
    // foydalanuvchini qaytaradi, aks holda null.
    async verifyCredentials(login:string, password:string){
        const user = await this.model.findOne({login})
        if(!user) return null

        const isSame = await bcrypt.compare(password, user.password)
        if(!isSame) return null

        return user
    }

    async linkTelegramChat(userId:string, chatId:string){
        await this.model.findByIdAndUpdate(userId, {telegram_chat_id:chatId})
    }

    async unlinkTelegramChat(chatId:string){
        await this.model.findOneAndUpdate({telegram_chat_id:chatId}, {telegram_chat_id:null})
    }

    async getByTelegramChatId(chatId:string){
        return await this.model.findOne({telegram_chat_id:chatId})
    }

    private async hashpass(pass:string){
        return await bcrypt.hash(pass,10);
    }

}