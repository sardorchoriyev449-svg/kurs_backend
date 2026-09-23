import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Topic } from "./model/topic.model";
import { Model } from "mongoose";
import { CreateTopicDto } from "./dtos/create-topic.dto";
import { UpdateTopicDto } from "./dtos/update-topic.dto";

@Injectable()
export class TopicService {
    constructor(
        @InjectModel(Topic.name) private readonly model: Model<Topic>
    ) {}

    async getAll() {
        const data = await this.model.find()
            .populate('course_id', 'name')
            .sort({ course_id: 1, order: 1 })

        return { success: true, length: data.length, data }
    }

    async getByCourse(courseId: string) {
        const data = await this.model.find({ course_id: courseId })
            .sort({ order: 1 })

        return { success: true, length: data.length, data }
    }

    async getOne(id: string) {
        const data = await this.model.findById(id).populate('course_id', 'name')
        if (!data) return { success: false, message: `Mavzu topilmadi!` }

        return { success: true, data }
    }

    async create(dto: CreateTopicDto, createdBy?: string) {
        const existing = await this.model.findOne({ course_id: dto.course_id, name: dto.name })
        if (existing) return { success: false, message: `Bu kursda shu nomdagi mavzu allaqachon bor!` }

        let order = dto.order
        if (order === undefined || order === null) {
            const count = await this.model.countDocuments({ course_id: dto.course_id })
            order = count
        }

        const newTopic = await this.model.create({
            course_id: dto.course_id,
            name: dto.name,
            order,
            description: dto.description,
            created_by: createdBy,
        })

        return { success: true, message: `Mavzu qo'shildi!`, data: newTopic }
    }

    async update(id: string, dto: UpdateTopicDto) {
        const data = await this.model.findById(id)
        if (!data) return { success: false, message: `Mavzu topilmadi!` }

        const updated = await this.model.findByIdAndUpdate(id, {
            name: dto.name ?? data.name,
            course_id: dto.course_id ?? data.course_id,
            order: dto.order ?? data.order,
            description: dto.description ?? data.description,
        }, { new: true })

        return { success: true, message: `Mavzu yangilandi!`, data: updated }
    }

    async delete(id: string) {
        const deleted = await this.model.findByIdAndDelete(id)
        if (!deleted) return { success: false, message: `Mavzu topilmadi!` }

        return { success: true, message: `Mavzu o'chirildi!` }
    }
}
