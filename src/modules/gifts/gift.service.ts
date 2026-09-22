import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Gift } from "./model/gift.model";
import { Model } from "mongoose";
import { CreateGiftDto } from "./dtos/create-gift.dto";
import { UpdateGiftDto } from "./dtos/update-gift.dto";
import { CoinService } from "../coins/coin.service";

@Injectable()
export class GiftService {
    constructor(
        @InjectModel(Gift.name) private readonly model: Model<Gift>,
        private readonly coinService: CoinService,
    ) {}

    async getAll() {
        const data = await this.model.find()
        return { success: true, length: data.length, data }
    }

    async getOne(id: string) {
        const data = await this.model.findById(id)
        if (!data) return { success: false, message: `Sovg'a topilmadi!` }

        return { success: true, data }
    }

    async create(dto: CreateGiftDto) {
        const existing = await this.model.findOne({ name: dto.name })
        if (existing) return { success: false, message: `Bunday nomdagi sovg'a allaqachon bor!` }

        const newGift = await this.model.create(dto)

        return { success: true, message: `Sovg'a qo'shildi!`, data: newGift }
    }

    async update(id: string, dto: UpdateGiftDto) {
        const data = await this.model.findById(id)
        if (!data) return { success: false, message: `Sovg'a topilmadi!` }

        const updated = await this.model.findByIdAndUpdate(id, {
            name: dto.name ?? data.name,
            price_coin: dto.price_coin ?? data.price_coin,
            stock: dto.stock ?? data.stock,
            description: dto.description ?? data.description,
            image: dto.image ?? data.image,
        }, { new: true })

        return { success: true, message: `Sovg'a yangilandi!`, data: updated }
    }

    async delete(id: string) {
        const deleted = await this.model.findByIdAndDelete(id)
        if (!deleted) return { success: false, message: `Sovg'a topilmadi!` }

        return { success: true, message: `Sovg'a o'chirildi!` }
    }

    // O'quvchi to'plagan coin'iga sovg'a sotib oladi (almashtiradi)
    async redeem(giftId: string, studentId: string, redeemedBy?: string) {
        const gift = await this.model.findById(giftId)
        if (!gift) return { success: false, message: `Sovg'a topilmadi!` }
        if (gift.stock <= 0) return { success: false, message: `Sovg'a qolmagan!` }

        const balance = await this.coinService.getBalance(studentId)
        if (balance < gift.price_coin) return { success: false, message: `Coin yetarli emas!` }

        await this.model.findByIdAndUpdate(giftId, { $inc: { stock: -1 } })

        await this.coinService.create({
            student_id: studentId,
            amount: -gift.price_coin,
            reason: `Sovg'a olindi: ${gift.name}`,
        }, redeemedBy)

        return { success: true, message: `Sovg'a muvaffaqiyatli olindi!` }
    }
}
