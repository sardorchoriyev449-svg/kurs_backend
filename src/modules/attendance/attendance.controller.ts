import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AttendanceService } from "./attendance.service";
import { CreateAttendanceDto } from "./dtos/create-attendance.dto";
import { UpdateAttendanceDto } from "./dtos/update-attendance.dto";
import { BulkAttendanceDto } from "./dtos/bulk-attendance.dto";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RequestWithUser, RolesGuard } from "../../common/guards/user-request.guard";
import { Protected } from "../../common/guards/protected.guard";
import { Roles } from "../../common/guards/roles.decorator";
import { UserRoles } from "../../common/guards/user-roles.guard";

// admin/super_admin har doim, + teacher ham davomat belgilay oladi (klass darajasida).
@Controller('attendance')
@Protected()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRoles.teacher)
export class AttendanceController {
    constructor(private readonly service: AttendanceService) {}

    @Get()
    async getAll() {
        return await this.service.getAll();
    }

    // O'quvchi o'z davomatini ko'radi. ':id'dan OLDIN turishi shart.
    @Get('me')
    @Roles(UserRoles.student)
    async getMine(@Req() req: RequestWithUser) {
        return await this.service.getByStudent(req.user.id);
    }

    @Get('lesson/:lessonId')
    async getByLesson(@Param('lessonId') lessonId: string) {
        return await this.service.getByLesson(lessonId);
    }

    @Get('student/:studentId')
    async getByStudent(@Param('studentId') studentId: string) {
        return await this.service.getByStudent(studentId);
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
        return await this.service.getOne(id);
    }

    @Post()
    async create(@Body() dto: CreateAttendanceDto, @Req() req: RequestWithUser) {
        return await this.service.create(dto, req.user.id);
    }

    // Bir dars uchun bir nechta o'quvchini bir yo'la belgilash (Yo'qlama ekrani uchun)
    @Post('bulk')
    async bulkMark(@Body() dto: BulkAttendanceDto, @Req() req: RequestWithUser) {
        return await this.service.bulkMark(dto, req.user.id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateAttendanceDto) {
        return await this.service.update(id, dto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.service.delete(id);
    }
}
