import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Attendance } from "./model/attendance.model";
import { Model } from "mongoose";
import { CreateAttendanceDto } from "./dtos/create-attendance.dto";
import { UpdateAttendanceDto } from "./dtos/update-attendance.dto";
import { BulkAttendanceDto } from "./dtos/bulk-attendance.dto";
import { AttendanceStatus } from "./attendance-status.enum";
import { CoinService } from "../coins/coin.service";

// Darsga "keldi" deb belgilansa, o'quvchiga avtomatik shuncha coin beriladi.
const ATTENDANCE_KELDI_COIN = 30;

@Injectable()
export class AttendanceService {
    constructor(
        @InjectModel(Attendance.name) private readonly model: Model<Attendance>,
        private readonly coinService: CoinService,
    ) {}

    async getAll() {
        const data = await this.model.find()
            .populate('student_id', 'first_name last_name login')
            .populate('lesson_id', 'name')

        return { success: true, length: data.length, data }
    }

    async getOne(id: string) {
        const data = await this.model.findById(id)
            .populate('student_id', 'first_name last_name login')
            .populate('lesson_id', 'name')

        if (!data) return { success: false, message: `Davomat topilmadi!` }

        return { success: true, data }
    }

    async getByLesson(lessonId: string) {
        const data = await this.model.find({ lesson_id: lessonId })
            .populate('student_id', 'first_name last_name login')

        return { success: true, length: data.length, data }
    }

    async getByStudent(studentId: string) {
        const data = await this.model.find({ student_id: studentId })
            .populate('lesson_id', 'name')

        return { success: true, length: data.length, data }
    }

    // "Keldi" uchun coin FAQAT BIR MARTA beriladi - holat keyinchalik
    // "kelmadi"ga o'zgartirilib, qayta "keldi"ga qaytarilsa ham coin qayta
    // berilmaydi (aks holda holatni oldinga-orqaga almashtirib coin farm
    // qilish mumkin bo'lar edi).
    private async awardAttendanceCoinIfNeeded(attendanceId: string, alreadyAwarded: boolean, newStatus: AttendanceStatus, studentId: string, markedBy: string) {
        if (newStatus !== AttendanceStatus.keldi || alreadyAwarded) return

        await this.coinService.create({
            student_id: studentId,
            amount: ATTENDANCE_KELDI_COIN,
            reason: `Darsga qatnashgani uchun`,
        }, markedBy)

        await this.model.findByIdAndUpdate(attendanceId, { coin_awarded: true })
    }

    async create(dto: CreateAttendanceDto, markedBy: string) {
        const existing = await this.model.findOne({ lesson_id: dto.lesson_id, student_id: dto.student_id })
        if (existing) return { success: false, message: `Bu o'quvchiga shu dars uchun davomat allaqachon qo'yilgan!` }

        const newAttendance = await this.model.create({
            lesson_id: dto.lesson_id,
            student_id: dto.student_id,
            status: dto.status,
            marked_by: markedBy,
        })

        await this.awardAttendanceCoinIfNeeded(String(newAttendance._id), false, dto.status, dto.student_id, markedBy)

        return { success: true, message: `Davomat belgilandi!`, data: newAttendance }
    }

    async bulkMark(dto: BulkAttendanceDto, markedBy: string) {
        const results = await Promise.all(
            dto.records.map(async (record) => {
                const existing = await this.model.findOne({ lesson_id: dto.lesson_id, student_id: record.student_id })
                const alreadyAwarded = existing?.coin_awarded ?? false

                const updated = await this.model.findOneAndUpdate(
                    { lesson_id: dto.lesson_id, student_id: record.student_id },
                    { status: record.status, marked_by: markedBy },
                    { upsert: true, new: true },
                )

                await this.awardAttendanceCoinIfNeeded(String(updated._id), alreadyAwarded, record.status, record.student_id, markedBy)

                return updated
            })
        )

        return { success: true, message: `Davomat saqlandi!`, length: results.length, data: results }
    }

    async update(id: string, dto: UpdateAttendanceDto) {
        const data = await this.model.findById(id)
        if (!data) return { success: false, message: `Davomat topilmadi!` }

        const newStatus = dto.status ?? data.status

        const updated = await this.model.findByIdAndUpdate(id, {
            status: newStatus,
        }, { new: true })

        await this.awardAttendanceCoinIfNeeded(id, data.coin_awarded, newStatus, String(data.student_id), String(data.marked_by))

        return { success: true, message: `Davomat yangilandi!`, data: updated }
    }

    async delete(id: string) {
        const deleted = await this.model.findByIdAndDelete(id)
        if (!deleted) return { success: false, message: `Davomat topilmadi!` }

        return { success: true, message: `Davomat o'chirildi!` }
    }
}
