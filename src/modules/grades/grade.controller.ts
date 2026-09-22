import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { GradeService } from "./grade.service";
import { CreateGradeDto } from "./dtos/create-grade.dto";
import { UpdateGradeDto } from "./dtos/update-grade.dto";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RequestWithUser, RolesGuard } from "../../common/guards/user-request.guard";
import { Protected } from "../../common/guards/protected.guard";
import { Roles } from "../../common/guards/roles.decorator";
import { UserRoles } from "../../common/guards/user-roles.guard";

// admin/super_admin har doim, + teacher ham baho qo'ya oladi (klass darajasida).
// 'me' yo'li esa metod darajasida @Roles(student) bilan almashtirilgan - shu
// bitta yo'lda faqat o'quvchi o'z bahosini ko'radi.
@Controller('grades')
@Protected()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRoles.teacher)
export class GradeController {
    constructor(private readonly service: GradeService) {}

    @Get()
    async getAll() {
        return await this.service.getAll();
    }

    // O'quvchining o'zi o'z baholarini ko'radi. ':id' bilan to'qnashmasligi
    // uchun aynan shu yerda, ':id' route'idan OLDIN turishi shart.
    @Get('me')
    @Roles(UserRoles.student)
    async getMine(@Req() req: RequestWithUser) {
        return await this.service.getByStudent(req.user.id);
    }

    @Get('student/:studentId')
    async getByStudent(@Param('studentId') studentId: string) {
        return await this.service.getByStudent(studentId);
    }

    @Get('lesson/:lessonId')
    async getByLesson(@Param('lessonId') lessonId: string) {
        return await this.service.getByLesson(lessonId);
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
        return await this.service.getOne(id);
    }

    @Post()
    async create(@Body() dto: CreateGradeDto, @Req() req: RequestWithUser) {
        return await this.service.create(dto, req.user.id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateGradeDto) {
        return await this.service.update(id, dto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.service.delete(id);
    }
}
