import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { TopicService } from "./topic.service";
import { CreateTopicDto } from "./dtos/create-topic.dto";
import { UpdateTopicDto } from "./dtos/update-topic.dto";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RequestWithUser, RolesGuard } from "../../common/guards/user-request.guard";
import { Protected } from "../../common/guards/protected.guard";
import { Roles } from "../../common/guards/roles.decorator";
import { UserRoles } from "../../common/guards/user-roles.guard";

@Controller('topics')
@Protected()
@UseGuards(AuthGuard, RolesGuard)
export class TopicController {
    constructor(private readonly service: TopicService) {}

    @Get()
    @Roles(UserRoles.teacher, UserRoles.student)
    async getAll() {
        return await this.service.getAll();
    }

    @Get('course/:courseId')
    @Roles(UserRoles.teacher, UserRoles.student)
    async getByCourse(@Param('courseId') courseId: string) {
        return await this.service.getByCourse(courseId);
    }

    @Get(':id')
    @Roles(UserRoles.teacher, UserRoles.student)
    async getOne(@Param('id') id: string) {
        return await this.service.getOne(id);
    }

    // admin har doim, + teacher ham yangi mavzu qo'sha oladi
    // (masalan rejadan tashqari qiziqarli savol chiqib qolganda)
    @Post()
    @Roles(UserRoles.teacher)
    async create(@Body() dto: CreateTopicDto, @Req() req: RequestWithUser) {
        return await this.service.create(dto, req.user.id);
    }

    // Tahrirlash/o'chirish - faqat admin/super_admin (dastur asosini boshqaradi)
    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateTopicDto) {
        return await this.service.update(id, dto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.service.delete(id);
    }
}
