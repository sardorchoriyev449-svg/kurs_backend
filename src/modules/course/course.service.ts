import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Course } from "./model/course.model";
import { Model, ObjectId, Types } from "mongoose";
import { CoursCreateDtos } from "./dtos/create.course.dtos";
import { CoursUpdateDtos } from "./dtos/update.course.dtos";

@Injectable()
export class CourseService{
    constructor(
        @InjectModel(Course.name) private readonly model:Model<Course>
    ){}

    async getAll(){
        const data = await this.model.find()

        return {
            success:true,
            length:data.length,
            data:data
        }
    }

    async getOne(id:Types.ObjectId){
        const data = await this.model.findOne({_id:id})
        if(!data) return {success:false, message:`Bunday kurs mavjut\'mas!`}

        return {
            success:true,
            data:data
        }
    }

    async create(dtos:CoursCreateDtos){
        const data = await this.model.findOne({name:dtos.name})
        if(data) return {success:false, message:`Bunday nomda kurs mavjut!`}

        const newCourse = await this.model.create({
            name:dtos.name,
            description:dtos.description,
            price:dtos.price,
        })

        return {
            success:true,
            data:newCourse
        }
    }

    async update(id:Types.ObjectId, dtos:CoursUpdateDtos){
        const data = await this.model.findOne({_id:id})
        if(!data) return {success:false, message:`Bunday kurs mavjut\'mas!`}

        const newCourse = await this.model.findOneAndUpdate({_id:id},{
            name:dtos.name ?? data.name,
            description:dtos.description ?? data.description,
            price:dtos.price ?? data.price,
        }, { new: true })

        return {
            success:true,
            message:`Muffaqiyatly yangilandi!`,
            data:newCourse
        }
    }

    async delete(id:Types.ObjectId){
        const data = await this.model.findByIdAndDelete({_id:id})
        if(!data) return {success:false, message:`Bunday kurs mavjut\'mas!`}

        return {
            success:true,
            message:`Muffaqiyatly o\'chirildi!`
        }
    }
    
}