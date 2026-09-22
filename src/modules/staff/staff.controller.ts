import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { StaffService } from "./staff.service";
import { CreateStaffDto } from "./dtos/create-staff.dto";
import { UpdateStaffDto } from "./dtos/update-staff.dto";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RolesGuard } from "../../common/guards/user-request.guard";
import { Protected } from "../../common/guards/protected.guard";

// Faqat admin/super_admin - xodimlar HR ma'lumoti (maosh va h.k.), teacher'ga ochilmagan
@Controller('staff')
@Protected()
@UseGuards(AuthGuard, RolesGuard)
export class StaffController {
    constructor(private readonly service: StaffService) {}

    @Get()
    async getAll() {
        return await this.service.getAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
        return await this.service.getOne(id);
    }

    @Post()
    async create(@Body() dto: CreateStaffDto) {
        return await this.service.create(dto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateStaffDto) {
        return await this.service.update(id, dto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.service.delete(id);
    }
}
