import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Freeze } from "./model/freeze.model";

@Injectable()
export class FreezeService{
    constructor(
        @InjectModel(Freeze.name) private readonly model:Model<Freeze>,
    ){}

    async freeze(group:string, student:string){
        // Qayta muzlatilsa ham vaqti yangilanadi (upsert)
        const data = await this.model.findOneAndUpdate(
            {group, student},
            {group, student, suspended_at:new Date()},
            {upsert:true, new:true},
        )

        return {
            success:true,
            message:`O'quvchi muzlatildi`,
            data,
        }
    }

    async unfreeze(group:string, student:string){
        const deleted = await this.model.findOneAndDelete({group, student})
        if(!deleted) return {success:false, message:`Bu o'quvchi muzlatilmagan edi`}

        return {
            success:true,
            message:`O'quvchi qayta faollashtirildi`,
        }
    }

    async getByGroup(group:string){
        const data = await this.model.find({group}).populate('student', 'first_name last_name login')

        return {
            success:true,
            length:data.length,
            data,
        }
    }

    async getOne(group:string, student:string){
        const data = await this.model.findOne({group, student})
        if(!data) return {success:false, message:`Bu o'quvchi muzlatilmagan`}

        return {
            success:true,
            data,
        }
    }

    // Boshqa modullar (lessons, homework-assignments) ichida foydalanish uchun:
    // shu talaba shu guruhda muzlatilgan bo'lsa, qachon muzlatilganini qaytaradi.
    async getSuspendedAt(group:string, student:string):Promise<Date | null>{
        const data = await this.model.findOne({group, student})
        return data ? data.suspended_at : null
    }
}
