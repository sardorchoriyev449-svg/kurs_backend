import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  Req,
  UseGuards 
} from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupCreateDto } from './dtos/group.create.dtos';
import { GroupUpdateDtos } from './dtos/group.update.dtos';
import { addStudentGroup } from './dtos/group.add.student';
import { GroupSuspendStudentDtos } from './dtos/group.suspend.dtos';
import { Types } from 'mongoose';
import { RequestWithUser, RolesGuard } from '../../common/guards/user-request.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Protected } from '../../common/guards/protected.guard';
import { Roles } from '../../common/guards/roles.decorator';
import { UserRoles } from '../../common/guards/user-roles.guard';

@Controller('groups')
@Protected()
@UseGuards(AuthGuard, RolesGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  async getAll() {
    return this.groupService.getAll();
  }

  // Joriy foydalanuvchining o'z guruhlari (teacher yoki student, roliga qarab).
  // ESLATMA: bu route ':id' catch-all'dan OLDIN turishi shart, aks holda
  // "/groups/mine" so'rovi getOne(id="mine") sifatida noto'g'ri ushlanadi.
  @Get('mine')
  @Roles(UserRoles.teacher, UserRoles.student)
  async getMine(@Req() req: RequestWithUser) {
    if (req.user.role === UserRoles.teacher) {
      return this.groupService.teacherGroups(req.user.id as any);
    }
    return this.groupService.studentGroups(req.user.id);
  }

  @Get('teacher/:teacherId')
  async getTeacherGroups(@Param('teacherId') teacherId: Types.ObjectId) {
    return this.groupService.teacherGroups(teacherId);
  }

  @Get('student/:studentId')
  async getStudentGroups(@Param('studentId') studentId: string) {
    return this.groupService.studentGroups(studentId);
  }

  @Get(':id/students')
  @Roles(UserRoles.teacher, UserRoles.student)
  async getAllStudentsGroup(@Param('id') id: Types.ObjectId) {
    return this.groupService.allStudentsGroup(id);
  }

  @Get(':id')
  @Roles(UserRoles.teacher, UserRoles.student)
  async getOne(@Param('id') id: Types.ObjectId) {
    return this.groupService.getOne(id as any);
  }

  @Post()
  async create(@Body() dto: GroupCreateDto) {
    return this.groupService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() dto: GroupUpdateDtos,
  ) {
    return this.groupService.update(dto, id);
  }

  @Post(':id/add-students')
  async addStudentGroup(
    @Param('id') id: Types.ObjectId,
    @Body() dto: addStudentGroup,
  ) {
    return this.groupService.addStudentGroup(id as any, dto);
  }

  // Faqat admin/super_admin (default RolesGuard cheklovi) - to'lov qilmagan
  // o'quvchini shu guruh doirasida muzlatish/faollashtirish.
  @Put(':id/students/:studentId/suspension')
  async setStudentSuspension(
    @Param('id') id: string,
    @Param('studentId') studentId: string,
    @Body() dto: GroupSuspendStudentDtos,
  ) {
    return this.groupService.setStudentSuspension(id, studentId, dto.suspended);
  }
}
