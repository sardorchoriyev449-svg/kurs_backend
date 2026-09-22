import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { CoinService } from "./coin.service";
import { CreateCoinDto } from "./dtos/create-coin.dto";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RequestWithUser, RolesGuard } from "../../common/guards/user-request.guard";
import { Protected } from "../../common/guards/protected.guard";
import { Roles } from "../../common/guards/roles.decorator";
import { UserRoles } from "../../common/guards/user-roles.guard";

@Controller('coins')
@Protected()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRoles.teacher)
export class CoinController {
    constructor(private readonly service: CoinService) {}

    @Get()
    async getAll() {
        return await this.service.getAll();
    }

    @Get('me')
    @Roles(UserRoles.student)
    async getMine(@Req() req: RequestWithUser) {
        return await this.service.getByStudent(req.user.id);
    }

    @Get('student/:studentId')
    async getByStudent(@Param('studentId') studentId: string) {
        return await this.service.getByStudent(studentId);
    }

    @Get('student/:studentId/balance')
    async getBalance(@Param('studentId') studentId: string) {
        const balance = await this.service.getBalance(studentId);
        return { success: true, data: { student_id: studentId, balance } };
    }

    @Post()
    async create(@Body() dto: CreateCoinDto, @Req() req: RequestWithUser) {
        return await this.service.create(dto, req.user.id);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.service.delete(id);
    }
}
