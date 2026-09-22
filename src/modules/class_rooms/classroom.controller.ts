import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ClassRoomService } from './classroom.service';
import { CreateClassRoomDto } from './dtos/create-classroom.dto';
import { UpdateClassRoomDto } from './dtos/update-classroom.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/user-request.guard';
import { Protected } from '../../common/guards/protected.guard';


@Controller('class-rooms')
@Protected()
@UseGuards(AuthGuard, RolesGuard)
export class ClassRoomController {
  constructor(private readonly classRoomService: ClassRoomService) {}

  @Post()
  async create(@Body() dto: CreateClassRoomDto) {
    return this.classRoomService.create(dto);
  }

  @Get()
  async getAll() {
    return this.classRoomService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.classRoomService.getOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateClassRoomDto) {
    return this.classRoomService.update(id, dto);
  }

  @Post(':id/assign-group/:groupId')
  async assignGroup(
    @Param('id') classroomId: string,
    @Param('groupId') groupId: string,
  ) {
    return this.classRoomService.assignGroup(classroomId, groupId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.classRoomService.remove(id);
  }
}