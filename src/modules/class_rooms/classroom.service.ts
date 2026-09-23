import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ClassRoom, ClassRoomDocument } from './model/classroom.model';
import { CreateClassRoomDto } from './dtos/create-classroom.dto';
import { UpdateClassRoomDto } from './dtos/update-classroom.dto';
import { Group } from '../groups/model/group.model'; // <-- yo'lni loyihangizdagi haqiqiy joyga moslang

@Injectable()
export class ClassRoomService {
  constructor(
    @InjectModel(ClassRoom.name) private readonly model: Model<ClassRoomDocument>,
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
  ) {}

  async create(dto: CreateClassRoomDto) {
    const existingRoom = await this.model.findOne({ name: dto.name });
    if (existingRoom) {
      return { success: false, message: 'Bunday nomli xona mavjud!' };
    }

    const newRoom = await this.model.create({
      ...dto,
      group_id: dto.group_id ? dto.group_id.map((id) => new Types.ObjectId(id)) : [],
    });

    return {
      success: true,
      message: 'Xona muvaffaqiyatli yaratildi!',
      data: newRoom,
    };
  }

  async getAll() {
    const rooms = await this.model.find().populate('group_id', 'name');
    return {
      success: true,
      length: rooms.length,
      data: rooms,
    };
  }

  async getOne(id: string) {
    const room = await this.model.findById(id).populate('group_id', 'name');
    if (!room) {
      return { success: false, message: 'Xona topilmadi!' };
    }
    return {
      success: true,
      data: room,
    };
  }

  async update(id: string, dto: UpdateClassRoomDto) {
    const room = await this.model.findById(id);
    if (!room) {
      return { success: false, message: 'Xona topilmadi!' };
    }

    const updatedRoom = await this.model.findByIdAndUpdate(
      id,
      {
        $set: {
          ...dto,
          group_id: dto.group_id ? dto.group_id.map((gId) => new Types.ObjectId(gId)) : room.group_id,
        },
      },
      { new: true },
    );

    return {
      success: true,
      message: 'Xona muvaffaqiyatli yangilandi!',
      data: updatedRoom,
    };
  }

  async assignGroup(classroomId: string, groupId: string) {
    const classroom = await this.model.findById(classroomId);
    if (!classroom) {
      return { success: false, message: 'Xona topilmadi!' };
    }

    const newGroup = await this.groupModel.findById(groupId);
    if (!newGroup) {
      return { success: false, message: 'Guruh topilmadi!' };
    }

    const alreadyHere = classroom.group_id.some((g) => g.toString() === groupId);
    if (alreadyHere) {
      return { success: false, message: 'Guruh allaqachon shu xonaga biriktirilgan!' };
    }

    // To'qnashuvni tekshirish: shu xonadagi BOSHQA guruhlar bilan kun/vaqt mos kelmasligi kerak
    // (bu guruhning o'zi hisobga olinmaydi, chunki u hali shu xonaga qo'shilmagan)
    const otherGroupIds = classroom.group_id.filter((g) => g.toString() !== groupId);
    if (otherGroupIds.length > 0) {
      const existingGroups = await this.groupModel.find({ _id: { $in: otherGroupIds } });

      for (const existingGroup of existingGroups) {
        const hasSharedDay = (existingGroup.lesson_days || []).some((day) =>
          (newGroup.lesson_days || []).includes(day),
        );
        if (!hasSharedDay) continue;

        if (this.isTimeOverlap(existingGroup.lesson_time, newGroup.lesson_time)) {
          return {
            success: false,
            message: `Xona shu kun/vaqtda band: "${existingGroup.name}" guruhi (${existingGroup.lesson_time}) bilan to'qnashadi!`,
          };
        }
      }
    }

    // Bitta guruh faqat bitta xonada bo'lishi kerak — shuning uchun avval uni
    // (agar bo'lsa) boshqa BARCHA xonalardan avtomatik chiqarib tashlaymiz
    await this.model.updateMany(
      { _id: { $ne: classroomId } },
      { $pull: { group_id: new Types.ObjectId(groupId) } },
    );

    const updatedRoom = await this.model.findByIdAndUpdate(
      classroomId,
      { $addToSet: { group_id: new Types.ObjectId(groupId) } },
      { new: true },
    );

    return {
      success: true,
      message: 'Guruh xonaga biriktirildi!',
      data: updatedRoom,
    };
  }

  async unassignGroup(classroomId: string, groupId: string) {
    const classroom = await this.model.findById(classroomId);
    if (!classroom) {
      return { success: false, message: 'Xona topilmadi!' };
    }

    const wasThere = classroom.group_id.some((g) => g.toString() === groupId);
    if (!wasThere) {
      return { success: false, message: 'Guruh bu xonaga biriktirilmagan!' };
    }

    const updatedRoom = await this.model.findByIdAndUpdate(
      classroomId,
      { $pull: { group_id: new Types.ObjectId(groupId) } },
      { new: true },
    );

    return {
      success: true,
      message: 'Guruh xonadan chiqarildi!',
      data: updatedRoom,
    };
  }

  async remove(id: string) {
    const deleted = await this.model.findByIdAndDelete(id);
    if (!deleted) {
      return { success: false, message: 'Xona topilmadi!' };
    }
    return {
      success: true,
      message: "Xona o'chirildi!",
    };
  }

  // ------- Yordamchi funksiyalar -------

  private isTimeOverlap(rangeA: string, rangeB: string): boolean {
    const a = this.parseTimeRange(rangeA);
    const b = this.parseTimeRange(rangeB);
    if (!a || !b) return true;
    return a.start < b.end && b.start < a.end;
  }

  private parseTimeRange(range: string): { start: number; end: number } | null {
    if (!range) return null;
    const match = range.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
    if (!match) return null;
    const [, h1, m1, h2, m2] = match;
    const start = Number(h1) * 60 + Number(m1);
    const end = Number(h2) * 60 + Number(m2);
    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return null;
    return { start, end };
  }
}