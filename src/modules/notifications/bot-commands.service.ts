import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Group } from "../groups/model/group.model";
import { HomeworkAssignment } from "../homework-assignments/model/homework-assignment.model";
import { Homework } from "../homework/model/homework.model";
import { GradeService } from "../grades/grade.service";
import { CoinService } from "../coins/coin.service";
import { UsersService } from "../users/user.service";
import { UserRoles } from "../../common/guards/user-roles.guard";

// Telegram bot buyruqlari uchun rolga xos ma'lumotlarni tayyorlaydi.
// Modul aylanma bog'lanishga (circular dependency) tushib qolmasligi uchun
// Group/HomeworkAssignment/Homework modellariga bevosita ulanadi (xuddi
// HomeworkAssignmentModule o'zi ham shunday qilgani kabi), GroupModule yoki
// HomeworkAssignmentModule'ni import qilmaydi.
@Injectable()
export class BotCommandsService {
    constructor(
        @InjectModel(Group.name) private readonly groupModel: Model<Group>,
        @InjectModel(HomeworkAssignment.name) private readonly assignmentModel: Model<HomeworkAssignment>,
        @InjectModel(Homework.name) private readonly homeworkModel: Model<Homework>,
        private readonly gradeService: GradeService,
        private readonly coinService: CoinService,
        private readonly usersService: UsersService,
    ) {}

    async studentGrades(studentId: string): Promise<string> {
        const res = await this.gradeService.getByStudent(studentId);
        if (!res.data || res.data.length === 0) return "Hali baholaringiz yo'q.";

        const rows = res.data
            .slice(-10)
            .reverse()
            .map((g: any) => `• ${g.lesson_id?.name ?? 'Dars'}: ${g.score} ball`);

        return `📊 Oxirgi baholaringiz:\n${rows.join('\n')}`;
    }

    async studentCoins(studentId: string): Promise<string> {
        const res = await this.coinService.getByStudent(studentId);
        return `💰 Koin balansingiz: ${res.balance ?? 0}`;
    }

    async teacherNotSubmitted(teacherId: string): Promise<string> {
        const groups = await this.groupModel.find({ teacher: teacherId });
        if (groups.length === 0) return "Sizga hali guruh biriktirilmagan.";

        const lines: string[] = [];

        for (const group of groups) {
            const assignment = await this.assignmentModel
                .findOne({ group_id: group._id })
                .sort({ createdAt: -1 });
            if (!assignment) continue;

            const groupWithStudents = await this.groupModel
                .findById(group._id)
                .populate('students', 'first_name last_name');
            const submissions = await this.homeworkModel.find({ assignment_id: assignment._id });
            const submittedIds = new Set(submissions.map((s) => String(s.student_id)));

            const notSubmitted = ((groupWithStudents?.students as any[]) ?? [])
                .filter((s) => !submittedIds.has(String(s._id)))
                .map((s) => `${s.first_name} ${s.last_name}`);

            if (notSubmitted.length > 0) {
                lines.push(`📁 ${group.name} — "${assignment.title}":\n${notSubmitted.join(', ')}`);
            }
        }

        if (lines.length === 0) return "Barcha o'quvchilar so'nggi vazifalarni topshirgan! 🎉";

        return `📌 So'nggi vazifalarni hali topshirmaganlar:\n\n${lines.join('\n\n')}`;
    }

    async adminStats(): Promise<string> {
        const usersRes = await this.usersService.getAll();
        const users = usersRes.data ?? [];
        const groupsCount = await this.groupModel.countDocuments();

        const students = users.filter((u) => u.role === UserRoles.student).length;
        const teachers = users.filter((u) => u.role === UserRoles.teacher).length;
        const admins = users.filter((u) => u.role === UserRoles.admin || u.role === UserRoles.superAdmin).length;

        return (
            `📊 Tizim statistikasi:\n` +
            `O'quvchilar: ${students}\n` +
            `O'qituvchilar: ${teachers}\n` +
            `Adminlar: ${admins}\n` +
            `Guruhlar: ${groupsCount}`
        );
    }
}
