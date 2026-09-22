import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Coin } from "./model/coin.model";
import { Model } from "mongoose";
import { CreateCoinDto } from "./dtos/create-coin.dto";

@Injectable()
export class CoinService {
    constructor(
        @InjectModel(Coin.name) private readonly model: Model<Coin>
    ) {}

    async getAll() {
        const data = await this.model.find()
            .populate('student_id', 'first_name last_name login')
            .populate('given_by', 'first_name last_name')
            .sort({ createdAt: -1 })

        return { success: true, length: data.length, data }
    }

    async getByStudent(studentId: string) {
        const data = await this.model.find({ student_id: studentId })
            .populate('given_by', 'first_name last_name')
            .sort({ createdAt: -1 })

        const balance = data.reduce((sum, item) => sum + item.amount, 0)

        return { success: true, length: data.length, balance, data }
    }

    async getBalance(studentId: string): Promise<number> {
        const data = await this.model.find({ student_id: studentId })
        return data.reduce((sum, item) => sum + item.amount, 0)
    }

    async create(dto: CreateCoinDto, givenBy?: string) {
        const newCoin = await this.model.create({
            student_id: dto.student_id,
            amount: dto.amount,
            reason: dto.reason,
            given_by: givenBy,
        })

        return { success: true, message: `Coin harakati qo'shildi!`, data: newCoin }
    }

    async delete(id: string) {
        const deleted = await this.model.findByIdAndDelete(id)
        if (!deleted) return { success: false, message: `Bunday yozuv topilmadi!` }

        return { success: true, message: `O'chirildi!` }
    }
}
