import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Req,
    UseGuards
} from "@nestjs/common";
import { HomeWorkService } from "./homework.service";
import { HomeworkCreateDtos } from "./dtos/create.homework";
import { HomeworkUpdateDtos } from "./dtos/update.homework";
import { RequestWithUser, RolesGuard } from "../../common/guards/user-request.guard";
import { Types } from "mongoose";
import { AuthGuard } from "../../common/guards/auth.guard";
import { Protected } from "../../common/guards/protected.guard";
import { Roles } from "../../common/guards/roles.decorator";
import { UserRoles } from "../../common/guards/user-roles.guard";

// @Roles bilan student ham (o'zinikini) qo'sha/yangilay oladi, teacher esa tekshiradi.
@Controller('homework')
@Protected()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRoles.student, UserRoles.teacher)
export class HomeworkController {
    constructor(private readonly homeworkService: HomeWorkService) { }

    @Get()
    async getAll() {
        return await this.homeworkService.getAll();
    }

    // O'quvchi o'z topshirgan vazifalarini ko'radi. ':id'dan OLDIN turishi shart.
    @Get('me')
    async getMine(@Req() req: RequestWithUser) {
        return await this.homeworkService.getByStudent(req.user.id);
    }

    // O'qituvchi bitta topshiriqqa (assignment) tushirilgan barcha javoblarni ko'radi.
    @Get('assignment/:assignment_id')
    async getByAssignment(@Param('assignment_id') assignment_id: string) {
        return await this.homeworkService.getByAssignment(assignment_id);
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
        return await this.homeworkService.getOne(new Types.ObjectId(id));
    }

    @Post('assignment/:assignment_id')
    async create(
        @Body() dtos: HomeworkCreateDtos,
        @Req() req: RequestWithUser,
        @Param('assignment_id') assignment_id: string
    ) {
        return await this.homeworkService.create(dtos, req, assignment_id);
    }

    @Put('assignment/:assignment_id/:id')
    async update(
        @Body() dtos: HomeworkUpdateDtos,
        @Req() req: RequestWithUser,
        @Param('assignment_id') assignment_id: string,
        @Param('id') id: string
    ) {
        return await this.homeworkService.update(dtos, req, assignment_id, id);
    }

    @Delete(':id')
    async delete(
        @Param('id') id: string,
        @Req() req: RequestWithUser
    ) {
        return await this.homeworkService.delete(id, req);
    }
}
