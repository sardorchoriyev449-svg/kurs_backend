import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { HomeworkAssignment } from "./model/homework-assignment.model";
import { CreateAssignmentDto } from "./dtos/create-assignment.dto";
import { UpdateAssignmentDto } from "./dtos/update-assignment.dto";
import { Group } from "../groups/model/group.model";
import { Homework } from "../homework/model/homework.model";
import { HomeworkStatus } from "../homework/homework-status.enum";
import { FreezeService } from "../freeze/freeze.service";

@Injectable()
export class HomeworkAssignmentService {
    constructor(
        @InjectModel(HomeworkAssignment.name) private readonly model: Model<HomeworkAssignment>,
        @InjectModel(Group.name) private readonly groupModel: Model<Group>,
        @InjectModel(Homework.name) private readonly homeworkModel: Model<Homework>,
        private readonly freezeService: FreezeService,
    ) {}

    async getByGroup(groupId: string, requestingStudentId?: string) {
        // Muzlatilgan talaba muzlatilgan payttagacha (aniq vaqti bilan) berilgan
        // vazifalarni ko'raveradi, keyin qo'shilganlari ko'rinmaydi.
        const query: Record<string, unknown> = { group_id: groupId }
        if (requestingStudentId) {
            const suspendedAt = await this.freezeService.getSuspendedAt(groupId, requestingStudentId)
            if (suspendedAt) {
                query.createdAt = { $lte: suspendedAt }
            }
        }

        const data = await this.model.find(query)
            .populate('topic_id', 'name')
            .sort({ createdAt: -1 })

        // Har bir topshiriq uchun nechta talaba topshirganini ham qo'shib beramiz
        const withCounts = await Promise.all(data.map(async (assignment) => {
            const submitted = await this.homeworkModel.countDocuments({ assignment_id: assignment._id })
            const accepted = await this.homeworkModel.countDocuments({ assignment_id: assignment._id, status: HomeworkStatus.accepted })
            return { ...assignment.toObject(), submitted_count: submitted, accepted_count: accepted }
        }))

        return { success: true, length: withCounts.length, data: withCounts }
    }

    async getOne(id: string) {
        const data = await this.model.findById(id)
            .populate('topic_id', 'name')
            .populate('group_id', 'name')

        if (!data) return { success: false, message: `Topshiriq topilmadi!` }

        return { success: true, data }
    }

    // Guruhdagi har bir talaba uchun: topshirganmi-yo'qmi, topshirgan bo'lsa holati/ball nima
    async getSubmissionStatus(id: string) {
        const assignment = await this.model.findById(id)
        if (!assignment) return { success: false, message: `Topshiriq topilmadi!` }

        const group = await this.groupModel.findById(assignment.group_id).populate('students', 'first_name last_name login')
        if (!group) return { success: false, message: `Guruh topilmadi!` }

        const submissions = await this.homeworkModel.find({ assignment_id: id })
        const byStudent = new Map(submissions.map((s) => [String(s.student_id), s]))

        const rows = (group.students as any[]).map((student) => ({
            student,
            submission: byStudent.get(String(student._id)) ?? null,
        }))

        return { success: true, length: rows.length, data: rows }
    }

    async create(dto: CreateAssignmentDto, createdBy: string) {
        const newAssignment = await this.model.create({
            group_id: dto.group_id,
            topic_id: dto.topic_id,
            title: dto.title,
            description: dto.description,
            attachment: dto.attachment,
            due_date: dto.due_date,
            created_by: createdBy,
        })

        return { success: true, message: `Vazifa yaratildi!`, data: newAssignment }
    }

    async update(id: string, dto: UpdateAssignmentDto) {
        const data = await this.model.findById(id)
        if (!data) return { success: false, message: `Topshiriq topilmadi!` }

        const updated = await this.model.findByIdAndUpdate(id, {
            topic_id: dto.topic_id ?? data.topic_id,
            title: dto.title ?? data.title,
            description: dto.description ?? data.description,
            attachment: dto.attachment ?? data.attachment,
            due_date: dto.due_date ?? data.due_date,
        }, { new: true })

        return { success: true, message: `Vazifa yangilandi!`, data: updated }
    }

    // Talaba shu topshiriqni topshira oladimi: muzlatilmagan bo'lsa - ha;
    // muzlatilgan bo'lsa ham, agar topshiriq muzlatilgan paytdan OLDIN berilgan
    // bo'lsa - baribir topshirishga ruxsat (to'lov qilingan davr uchun).
    async canStudentSubmit(assignmentId: string, studentId: string): Promise<boolean> {
        const assignment = await this.model.findById(assignmentId)
        if (!assignment) return false

        const suspendedAt = await this.freezeService.getSuspendedAt(String(assignment.group_id), studentId)
        if (!suspendedAt) return true

        const assignmentCreatedAt = (assignment as any).createdAt as Date
        return assignmentCreatedAt <= suspendedAt
    }

    async delete(id: string) {
        const deleted = await this.model.findByIdAndDelete(id)
        if (!deleted) return { success: false, message: `Topshiriq topilmadi!` }

        return { success: true, message: `Vazifa o'chirildi!` }
    }
}
