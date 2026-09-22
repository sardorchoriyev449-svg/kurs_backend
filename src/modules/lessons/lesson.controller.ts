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
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RequestWithUser, RolesGuard } from '../../common/guards/user-request.guard';
import { UpdateLessonDto } from './dtos/update-lesson.dtos';
import { Protected } from '../../common/guards/protected.guard';
import { Roles } from '../../common/guards/roles.decorator';
import { UserRoles } from '../../common/guards/user-roles.guard';


@Controller('lessons')
@Protected()
@UseGuards(AuthGuard, RolesGuard)
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @Roles(UserRoles.teacher)
  async create(
    @Body() dto: CreateLessonDto, 
    @Req() req: RequestWithUser
  ) {
    return this.lessonService.create(dto, req.user.id);
  }

  @Get()
  async getAll() {
    return this.lessonService.getAll();
  }

  @Get('group/:groupId')
  @Roles(UserRoles.teacher, UserRoles.student)
  async getByGroup(@Param('groupId') groupId: string) {
    return this.lessonService.getByGroup(groupId);
  }

  @Get(':id')
  @Roles(UserRoles.teacher, UserRoles.student)
  async getOne(@Param('id') id: string) {
    return this.lessonService.getOne(id);
  }

  @Put(':id')
  @Roles(UserRoles.teacher)
  async update(
    @Param('id') id: string, 
    @Body() dto: UpdateLessonDto
  ) {
    return this.lessonService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRoles.teacher)
  async remove(@Param('id') id: string) {
    return this.lessonService.remove(id);
  }
}
