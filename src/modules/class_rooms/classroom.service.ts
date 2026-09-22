import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ClassRoom, ClassRoomDocument } from './model/classroom.model';
import { CreateClassRoomDto } from './dtos/create-classroom.dto';
import { UpdateClassRoomDto } from './dtos/update-classroom.dto';

@Injectable()
export class ClassRoomService {
  constructor(
    @InjectModel(ClassRoom.name) private readonly model: Model<ClassRoomDocument>,
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
    const resolt = await this.model.findOne({_id:classroomId, group_id:groupId})
    if(resolt) return { success:false, message:`Xona alaqachon birikan!`}
    
    const updatedRoom = await this.model.findByIdAndUpdate(
      classroomId,
      { $addToSet: { group_id: new Types.ObjectId(groupId) } },
      { new: true },
    );

    if (!updatedRoom) {
      return { success: false, message: 'Xona topilmadi!' };
    }

    return {
      success: true,
      message: 'Guruh xonaga biriktirildi!',
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
}