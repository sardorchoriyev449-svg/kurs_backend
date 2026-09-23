import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Group } from "./model/group.model";
import { Model, ObjectId, Types } from "mongoose";
import { GroupCreateDto } from "./dtos/group.create.dtos";
import { GroupUpdateDtos } from "./dtos/group.update.dtos";
import { addStudentGroup } from "./dtos/group.add.student";

@Injectable()
export class GroupService{
    constructor(
        @InjectModel(Group.name) private readonly model:Model<Group>,
    ){}

    async getAll(){
        const groups = await this.model.find().populate('course_id', 'name price')

        return {
            success:true,
            length:groups.length,
            data:groups
        }
    }

    async getOne(id:ObjectId){
        const group = await this.model.findOne({_id:id}).populate('course_id', 'name price')

        if(!group) return {success:false, message:`Bunaqa Malumot Yoq!`}

        return {
            success:true,
            data:group
        }
    }

    async teacherGroups(id:Types.ObjectId){
        const group = await this.model.find({teacher:id}).populate('course_id', 'name price')
        if(!group) return {success:false, message:`Grupa yoq!`}

        return {
            success:true,
            length:group.length,
            data:group
        }
    }

    async studentGroups(id:string){
        const group = await this.model.find({students:id}).populate('course_id', 'name price')

        return {
            success:true,
            length:group.length,
            data:group
        }
    }

    async allStudentsGroup(id:Types.ObjectId){
        const group = await this.model.findById(id).populate('students')
        if(!group) return {success:false, message:`Grupa yoq!`}
        if(!group.students || group.students.length == 0) return {success:false, message:`Bu Grupa'da o'quvchilar yoq!`}

        return {
            success:true,
            length:group.students.length,
            data:group.students
        }
    }

    async create(dtos:GroupCreateDto){
        const group = await this.model.findOne({name:dtos.name});
        if(group) return {success:false, message:`Bunday nomliy grupa bor!`}

        console.log(dtos);

        const newGroup = await this.model.create({
            name:dtos.name,
            lesson_time: dtos.lesson_time, 
            lesson_days: dtos.lesson_days,
            teacher: dtos.teacher,
            course_id:dtos.course_id,
        })
        return {
            success:true,
            message:`Mufaqiyatly yaratildi!`,
            data:newGroup
        }
    }

    async update(dtos:GroupUpdateDtos, id:Types.ObjectId){
        const group = await this.model.findById(id);
        if(!group) return {success:false, message:`Bunday grupa yoq!`}

        console.log(dtos);

        const newGroup = await this.model.findByIdAndUpdate(id,{
            name:dtos.name ?? group.name,
            lesson_time: dtos.lesson_time ?? group.lesson_time, 
            lesson_days: dtos.lesson_days ?? group.lesson_days,
            teacher: dtos.teacher ?? group.teacher,
            course_id:dtos.course_id ?? group.course_id,
        },{new:true})

        return {
            success:true,
            message:`Mufaqiyatly yangilandi!`,
            data:newGroup
        } 
    }

    async setStudentSuspension(group_id:string, studentId:string, suspended:boolean){
        const group = await this.model.findById(group_id)
        if(!group) return {success:false, message:`Bunday grupa yoq!`}

        // Avval eski yozuvni tozalab olamiz (qayta muzlatilganda vaqt yangilansin)
        await this.model.findByIdAndUpdate(group_id,{
            $pull:{suspended_students: {student: studentId}}
        })

        if(suspended){
            await this.model.findByIdAndUpdate(group_id,{
                $push:{suspended_students: {student: studentId, suspended_at: new Date()}}
            })
        }

        return {
            success:true,
            message: suspended ? `O'quvchi muzlatildi` : `O'quvchi qayta faollashtirildi`,
        }
    }

    // Talaba muzlatilgan bo'lsa qachon muzlatilganini qaytaradi, aks holda null
    async getStudentSuspendedAt(group_id:string, studentId:string):Promise<Date | null>{
        const group = await this.model.findOne(
            {_id:group_id, 'suspended_students.student':studentId},
            {'suspended_students.$':1}
        )
        if(!group || !group.suspended_students || group.suspended_students.length === 0) return null
        return group.suspended_students[0].suspended_at
    }

    async addStudentGroup(group_id:ObjectId, dtos:addStudentGroup){
        const group = await this.model.findById(group_id)
        if(!group) return {success:false, message:`Bunday grupa yoq!`}

        const student = await this.model.findOne({
            _id:group_id,
            students: {$in: dtos.students}
        })

        if(student) return {success:false, message:`Bu o'quvchi alaqachon o'qayabti!`}

        const newGroup = await this.model.findByIdAndUpdate(group_id,{
            $addToSet:{students: {$each: dtos.students}}
        },{new:true})

        return {
            success:true,
            message:`Mufaqiyatly qo'shildi!`,
            data:newGroup
        } 
    }
}