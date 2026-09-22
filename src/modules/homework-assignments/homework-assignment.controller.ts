import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { HomeworkAssignmentService } from "./homework-assignment.service";
import { CreateAssignmentDto } from "./dtos/create-assignment.dto";
import { UpdateAssignmentDto } from "./dtos/update-assignment.dto";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RequestWithUser, RolesGuard } from "../../common/guards/user-request.guard";
import { Protected } from "../../common/guards/protected.guard";
import { Roles } from "../../common/guards/roles.decorator";
import { UserRoles } from "../../common/guards/user-roles.guard";

// admin/super_admin har doim, + teacher ham vazifa yarata/tekshira oladi.
// student esa faqat ko'rish uchun (getByGroup/getOne) qo'shiladi.
@Controller('homework-assignments')
@Protected()
@UseGuards(AuthGuard, RolesGuard)
export class HomeworkAssignmentController {
    constructor(private readonly service: HomeworkAssignmentService) {}

    @Get('group/:groupId')
    @Roles(UserRoles.teacher, UserRoles.student)
    async getByGroup(@Param('groupId') groupId: string) {
        return await this.service.getByGroup(groupId);
    }

    @Get(':id/status')
    @Roles(UserRoles.teacher)
    async getSubmissionStatus(@Param('id') id: string) {
        return await this.service.getSubmissionStatus(id);
    }

    @Get(':id')
    @Roles(UserRoles.teacher, UserRoles.student)
    async getOne(@Param('id') id: string) {
        return await this.service.getOne(id);
    }

    @Post()
    @Roles(UserRoles.teacher)
    async create(@Body() dto: CreateAssignmentDto, @Req() req: RequestWithUser) {
        return await this.service.create(dto, req.user.id);
    }

    @Put(':id')
    @Roles(UserRoles.teacher)
    async update(@Param('id') id: string, @Body() dto: UpdateAssignmentDto) {
        return await this.service.update(id, dto);
    }

    @Delete(':id')
    @Roles(UserRoles.teacher)
    async delete(@Param('id') id: string) {
        return await this.service.delete(id);
    }
}
