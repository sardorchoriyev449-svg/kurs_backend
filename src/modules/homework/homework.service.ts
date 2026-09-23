import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Homework } from "./model/homework.model";
import { Model, Types } from "mongoose";
import { HomeworkCreateDtos } from "./dtos/create.homework";
import { RequestWithUser } from "../../common/guards/user-request.guard";
import { UsersService } from "../users/user.service";
import { HomeworkAssignmentService } from "../homework-assignments/homework-assignment.service";
import { HomeworkUpdateDtos } from "./dtos/update.homework";
import { UserRoles } from "../../common/guards/user-roles.guard";
import { HomeworkStatus } from "./homework-status.enum";
import { CoinService } from "../coins/coin.service";
import { TelegramService } from "../notifications/telegram.service";

// Uy vazifasi qabul qilinganda ball (0-100) asosida coin hisoblanadi:
// 0 ball -> 5 coin, 100 ball -> 50 coin, oralig'i chiziqli.
const HOMEWORK_COIN_MIN = 5;
const HOMEWORK_COIN_MAX = 50;

function calcHomeworkCoin(score: number): number {
    const raw = HOMEWORK_COIN_MIN + (score / 100) * (HOMEWORK_COIN_MAX - HOMEWORK_COIN_MIN);
    return Math.min(HOMEWORK_COIN_MAX, Math.max(HOMEWORK_COIN_MIN, Math.round(raw)));
}

@Injectable()
export class HomeWorkService {
    constructor(
        @InjectModel(Homework.name) private readonly model: Model<Homework>,
        private readonly UserService: UsersService,
        private readonly assignmentService: HomeworkAssignmentService,
        private readonly coinService: CoinService,
        private readonly telegramService: TelegramService,
    ) { }

    async getAll() {
        const data = await this.model.find()
        return {
            success: true,
            length: data.length,
            data: data
        }
    }

    async getOne(id: Types.ObjectId) {
        const data = await this.model.findById(id)
        if (!data) return { success: false, message: `Uy ishi mavjut\'mas` }

        return {
            success: true,
            data: data
        }
    }

    async getByStudent(studentId: string) {
        const data = await this.model.find({ student_id: studentId })
        return {
            success: true,
            length: data.length,
            data: data
        }
    }

    async getByAssignment(assignmentId: string) {
        const data = await this.model.find({ assignment_id: assignmentId })
            .populate('student_id', 'first_name last_name login')
        return {
            success: true,
            length: data.length,
            data: data
        }
    }

    async create(dtos: HomeworkCreateDtos, req: RequestWithUser, assignment_id: string) {
        const userResult = await this.UserService.getOne(req?.user?.id);
        const assignmentResult = await this.assignmentService.getOne(assignment_id);
        if (!userResult.success || !assignmentResult.success) return { success: false, message: userResult.message ?? assignmentResult.message }

        const existing = await this.model.findOne({ assignment_id, student_id: req?.user?.id })
        if (existing) return { success: false, message: `Siz bu vazifani allaqachon topshirgansiz!` }

        const canSubmit = await this.assignmentService.canStudentSubmit(assignment_id, req.user.id)
        if (!canSubmit) return { success: false, message: `Siz muzlatilganingizdan keyin berilgan vazifani topshira olmaysiz. Administrator bilan bog'laning.` }

        const newWork = await this.model.create({
            file_name: dtos.file_name,
            description: dtos.description,
            assignment_id: assignment_id,
            student_id: req?.user?.id,
        })

        const student = userResult.data as any
        const assignment = assignmentResult.data as any
        this.telegramService.notifyAdmin(
            `📚 Yangi uy vazifasi topshirildi!\n` +
            `O'quvchi: ${student.first_name} ${student.last_name}\n` +
            `Vazifa: ${assignment.title}`
        )

        return {
            data: newWork,
            success: true,
            message: `Uy vazifasi yuborildi!`
        }
    }

    async update(dtos: HomeworkUpdateDtos, req: RequestWithUser, assignment_id: string, id: string) {
        const userResult = await this.UserService.getOne(req?.user?.id);
        const assignmentResult = await this.assignmentService.getOne(assignment_id);
        if (!userResult.success || !assignmentResult.success) return { success: false, message: userResult.message ?? assignmentResult.message }

        const data = await this.model.findOne({ _id: id })
        if (!data) return { success: false, message: `Uy ishi mavjut\'mas` }

        const isOwner = String(data.student_id) === String(req.user.id)
        const isAdmin = req.user.role === UserRoles.admin || req.user.role === UserRoles.superAdmin
        const isTeacher = req.user.role === UserRoles.teacher
        if (!isOwner && !isAdmin && !isTeacher) return { success: false, message: `siz o'zgartirolmaysiz!` }

        // Talaba faqat o'z fayli/tavsifini o'zgartiradi.
        // O'qituvchi/admin esa faqat tekshiruv natijasini (status, ball, izoh) qo'yadi.
        const payload: Record<string, unknown> = {
            file_name: dtos.file_name ?? data.file_name,
            description: dtos.description ?? data.description,
        }

        if (isTeacher || isAdmin) {
            const newStatus = dtos.status ?? data.status
            const newScore = dtos.score ?? data.score

            payload.status = newStatus
            payload.teacher_comment = dtos.teacher_comment ?? data.teacher_comment
            payload.score = newScore
            payload.reviewed_by = req.user.id

            // Coin faqat bir marta, faqat "accepted" holatida va ball kiritilgan bo'lsa beriladi.
            if (newStatus === HomeworkStatus.accepted && !data.coin_awarded && typeof newScore === 'number') {
                const coinAmount = calcHomeworkCoin(newScore)
                await this.coinService.create({
                    student_id: String(data.student_id),
                    amount: coinAmount,
                    reason: `Uy vazifasi qabul qilindi (${newScore} ball)`,
                }, req.user.id)
                payload.coin_awarded = true
            }
        }

        const newWork = await this.model.findByIdAndUpdate(id, payload, {
            new:true
        })
        return {
            data: newWork,
            success: true,
            message: `Dars yangilandi!`
        }
    }

    async delete(id: string, req: RequestWithUser,) {
        const data = await this.model.findOne({ _id: id })
        if (!data) return { success: false, message: `Uy ishi mavjut\'mas` }

        const isOwner = String(data.student_id) === String(req.user.id)
        const isAdmin = req.user.role === UserRoles.admin || req.user.role === UserRoles.superAdmin
        if (!isOwner && !isAdmin) return { success: false, message: `siz o'chirolmaysiz!` }

        await this.model.findByIdAndDelete(id)

        return {
            success: true,
            message: `Dars o\'chirildi!`
        }
    }
}
