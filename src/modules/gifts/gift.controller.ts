import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { GiftService } from "./gift.service";
import { CreateGiftDto } from "./dtos/create-gift.dto";
import { UpdateGiftDto } from "./dtos/update-gift.dto";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RequestWithUser, RolesGuard } from "../../common/guards/user-request.guard";
import { Protected } from "../../common/guards/protected.guard";
import { Roles } from "../../common/guards/roles.decorator";
import { UserRoles } from "../../common/guards/user-roles.guard";

// admin/super_admin har doim, + teacher ham sovg'a bera (redeem qila) oladi (klass darajasida).
@Controller('gifts')
@Protected()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRoles.teacher)
export class GiftController {
    constructor(private readonly service: GiftService) {}

    // Katalogni o'quvchi ham ko'ra oladi (faqat ko'rish, sotib olishni
    // teacher/admin "Berish" orqali amalga oshiradi)
    @Get()
    @Roles(UserRoles.teacher, UserRoles.student)
    async getAll() {
        return await this.service.getAll();
    }

    @Get(':id')
    @Roles(UserRoles.teacher, UserRoles.student)
    async getOne(@Param('id') id: string) {
        return await this.service.getOne(id);
    }

    @Post()
    async create(@Body() dto: CreateGiftDto) {
        return await this.service.create(dto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateGiftDto) {
        return await this.service.update(id, dto);
    }

    @Post(':id/redeem/:studentId')
    async redeem(
        @Param('id') id: string,
        @Param('studentId') studentId: string,
        @Req() req: RequestWithUser,
    ) {
        return await this.service.redeem(id, studentId, req.user.id);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.service.delete(id);
    }
}
