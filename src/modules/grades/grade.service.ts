import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Grade } from "./model/grade.model";
import { Model } from "mongoose";
import { CreateGradeDto } from "./dtos/create-grade.dto";
import { UpdateGradeDto } from "./dtos/update-grade.dto";

@Injectable()
export class GradeService {
    constructor(
        @InjectModel(Grade.name) private readonly model: Model<Grade>
    ) {}

    async getAll() {
        const data = await this.model.find()
            .populate('student_id', 'first_name last_name login')
            .populate('lesson_id', 'name')
            .populate('graded_by', 'first_name last_name')

        return { success: true, length: data.length, data }
    }

    async getOne(id: string) {
        const data = await this.model.findById(id)
            .populate('student_id', 'first_name last_name login')
            .populate('lesson_id', 'name')
            .populate('graded_by', 'first_name last_name')

        if (!data) return { success: false, message: `Baho topilmadi!` }

        return { success: true, data }
    }

    async getByStudent(studentId: string) {
        const data = await this.model.find({ student_id: studentId })
            .populate('lesson_id', 'name')
            .populate('graded_by', 'first_name last_name')

        return { success: true, length: data.length, data }
    }

    async getByLesson(lessonId: string) {
        const data = await this.model.find({ lesson_id: lessonId })
            .populate('student_id', 'first_name last_name login')

        return { success: true, length: data.length, data }
    }

    async create(dto: CreateGradeDto, gradedBy: string) {
        const newGrade = await this.model.create({
            student_id: dto.student_id,
            lesson_id: dto.lesson_id,
            score: dto.score,
            comment: dto.comment,
            graded_by: gradedBy,
        })

        return { success: true, message: `Baho qo'yildi!`, data: newGrade }
    }

    async update(id: string, dto: UpdateGradeDto) {
        const data = await this.model.findById(id)
        if (!data) return { success: false, message: `Baho topilmadi!` }

        const updated = await this.model.findByIdAndUpdate(id, {
            score: dto.score ?? data.score,
            comment: dto.comment ?? data.comment,
        }, { new: true })

        return { success: true, message: `Baho yangilandi!`, data: updated }
    }

    async delete(id: string) {
        const deleted = await this.model.findByIdAndDelete(id)
        if (!deleted) return { success: false, message: `Baho topilmadi!` }

        return { success: true, message: `Baho o'chirildi!` }
    }
}
