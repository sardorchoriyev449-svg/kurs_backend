import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Lesson, LessonDocument } from './model/lesson.model';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { UpdateLessonDto } from './dtos/update-lesson.dtos';
import { RequestWithUser } from '../../common/guards/user-request.guard';
import { Group } from '../groups/model/group.model';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name) private readonly model: Model<Lesson>,
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
  ) {}

  async create(dto: CreateLessonDto, authorId: string) {
    const newLesson = await this.model.create({
      name: dto.name,
      description: dto.description,
      author: new Types.ObjectId(authorId),
      group_id: new Types.ObjectId(dto.group_id),
      topic_id: dto.topic_id ? new Types.ObjectId(dto.topic_id) : undefined,
      date: dto.date ? new Date(dto.date) : new Date(),
      video_uri: dto.video_uri,
      file_uri: dto.file_uri,
    });

    return {
      success: true,
      message: "Dars muvaffaqiyatli yaratildi!",
      data: newLesson,
    };
  }

  async getAll() {
    const lessons = await this.model
      .find()
      .populate('author', 'first_name last_name login')
      .populate('group_id', 'name')
      .populate('topic_id', 'name');

    return {
      success: true,
      length: lessons.length,
      data: lessons,
    };
  }

  async getByGroup(groupId: string, requestingStudentId?: string) {
    if (requestingStudentId) {
      const suspended = await this.groupModel.exists({
        _id: groupId,
        suspended_students: requestingStudentId,
      });
      if (suspended) {
        return {
          success: false,
          message: `Siz ushbu guruhda vaqtincha muzlatilgansiz. Administrator bilan bog'laning.`,
          data: [],
        };
      }
    }

    const lessons = await this.model
      .find({ group_id: new Types.ObjectId(groupId) })
      .populate('author', 'first_name last_name')
      .populate('topic_id', 'name')
      .sort({ date: -1, createdAt: -1 });

    return {
      success: true,
      length: lessons.length,
      data: lessons,
    };
  }

  async getOne(id: string) {
    const lesson = await this.model
      .findById(id)
      .populate('author', 'first_name last_name')
      .populate('group_id', 'name')
      .populate('topic_id', 'name');

    if (!lesson) {
      return { success: false, message: "Dars topilmadi!" };
    }

    return {
      success: true,
      data: lesson,
    };
  }

  async update(id: string, dto: UpdateLessonDto) {
    const updatedLesson = await this.model.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true },
    );

    if (!updatedLesson) {
      return { success: false, message: "Dars topilmadi!" };
    }

    return {
      success: true,
      message: "Dars muvaffaqiyatli yangilandi!",
      data: updatedLesson,
    };
  }

  async remove(id: string) {
    const deleted = await this.model.findByIdAndDelete(id);

    if (!deleted) {
      return { success: false, message: "Dars topilmadi!" };
    }

    return {
      success: true,
      message: "Dars o'chirib tashlandi!",
    };
  }
}
