import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { FreezeService } from "./freeze.service";
import { FreezeCreateDtos } from "./dtos/freeze.create.dtos";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RolesGuard } from "../../common/guards/user-request.guard";
import { Protected } from "../../common/guards/protected.guard";
import { Roles } from "../../common/guards/roles.decorator";
import { UserRoles } from "../../common/guards/user-roles.guard";

// Muzlatish/faollashtirish (yaratish/o'chirish) - faqat admin/super_admin
// (default RolesGuard cheklovi). Guruh bo'yicha ro'yxatni teacher ham
// o'z guruhi uchun ko'ra oladi.
@Controller('freeze')
@Protected()
@UseGuards(AuthGuard, RolesGuard)
export class FreezeController{
    constructor(
        private readonly service:FreezeService,
    ){}

    @Post()
    async create(@Body() dto:FreezeCreateDtos){
        return await this.service.freeze(dto.group, dto.student)
    }

    @Get('group/:group')
    @Roles(UserRoles.teacher)
    async getByGroup(@Param('group') group:string){
        return await this.service.getByGroup(group)
    }

    @Get('group/:group/student/:student')
    @Roles(UserRoles.teacher)
    async getOne(@Param('group') group:string, @Param('student') student:string){
        return await this.service.getOne(group, student)
    }

    @Delete('group/:group/student/:student')
    async delete(@Param('group') group:string, @Param('student') student:string){
        return await this.service.unfreeze(group, student)
    }
}
