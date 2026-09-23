import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Lesson, LessonDocument } from './model/lesson.model';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { UpdateLessonDto } from './dtos/update-lesson.dtos';
import { RequestWithUser } from '../../common/guards/user-request.guard';
import { FreezeService } from '../freeze/freeze.service';
import { TopicService } from '../topics/topic.service';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name) private readonly model: Model<Lesson>,
    private readonly freezeService: FreezeService,
    private readonly topicService: TopicService,
  ) {}

  // Dars nomi kiritilmasa: mavzu tanlangan bo'lsa o'sha mavzu nomi ishlatiladi
  // (mavzu nomining o'zi darsning nima ekanligini bildiradi), aks holda sana
  // bilan umumiy nom qo'yiladi.
  private async resolveLessonName(dto: CreateLessonDto): Promise<string> {
    if (dto.name?.trim()) return dto.name.trim();

    if (dto.topic_id) {
      const topicRes = await this.topicService.getOne(dto.topic_id);
      if (topicRes.success && topicRes.data) return topicRes.data.name;
    }

    const date = dto.date ? new Date(dto.date) : new Date();
    return `Dars - ${date.toLocaleDateString('uz-UZ')}`;
  }

  async create(dto: CreateLessonDto, authorId: string) {
    const name = await this.resolveLessonName(dto);

    const newLesson = await this.model.create({
      name,
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
    // Muzlatilgan talaba muzlatilgan payttagacha (aniq vaqti bilan) qo'shilgan
    // darslarni ko'raveradi - to'lov qilingan davr uchun kirish saqlanadi.
    // Muzlatilgandan keyin qo'shilgan yangi darslar esa ko'rinmaydi.
    const suspendedAt = requestingStudentId
      ? await this.freezeService.getSuspendedAt(groupId, requestingStudentId)
      : null;

    const query: Record<string, unknown> = { group_id: new Types.ObjectId(groupId) };
    if (suspendedAt) {
      query.createdAt = { $lte: suspendedAt };
    }

    const lessons = await this.model
      .find(query)
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
