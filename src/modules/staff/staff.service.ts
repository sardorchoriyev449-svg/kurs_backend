import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Staff } from "./model/staff.model";
import { Model } from "mongoose";
import { CreateStaffDto } from "./dtos/create-staff.dto";
import { UpdateStaffDto } from "./dtos/update-staff.dto";

@Injectable()
export class StaffService {
    constructor(
        @InjectModel(Staff.name) private readonly model: Model<Staff>
    ) {}

    async getAll() {
        const data = await this.model.find()
        return { success: true, length: data.length, data }
    }

    async getOne(id: string) {
        const data = await this.model.findById(id)
        if (!data) return { success: false, message: `Xodim topilmadi!` }

        return { success: true, data }
    }

    async create(dto: CreateStaffDto) {
        const existing = await this.model.findOne({ phone: dto.phone })
        if (existing) return { success: false, message: `Bu telefon raqam bilan xodim allaqachon bor!` }

        const newStaff = await this.model.create(dto)

        return { success: true, message: `Xodim qo'shildi!`, data: newStaff }
    }

    async update(id: string, dto: UpdateStaffDto) {
        const data = await this.model.findById(id)
        if (!data) return { success: false, message: `Xodim topilmadi!` }

        const updated = await this.model.findByIdAndUpdate(id, {
            first_name: dto.first_name ?? data.first_name,
            last_name: dto.last_name ?? data.last_name,
            phone: dto.phone ?? data.phone,
            position: dto.position ?? data.position,
            salary: dto.salary ?? data.salary,
            hire_date: dto.hire_date ?? data.hire_date,
            address: dto.address ?? data.address,
        }, { new: true })

        return { success: true, message: `Xodim yangilandi!`, data: updated }
    }

    async delete(id: string) {
        const deleted = await this.model.findByIdAndDelete(id)
        if (!deleted) return { success: false, message: `Xodim topilmadi!` }

        return { success: true, message: `Xodim o'chirildi!` }
    }
}
