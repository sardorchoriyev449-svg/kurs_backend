import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Telegraf } from "telegraf";
import { getTelegramAdminId, getTelegramBotToken } from "../../common/configs/telegram.config";

@Injectable()
export class TelegramService implements OnModuleInit {
    private readonly logger = new Logger(TelegramService.name);
    private bot: Telegraf | null = null;

    onModuleInit() {
        const token = getTelegramBotToken();
        if (!token) return;
        this.bot = new Telegraf(token);
    }

    // Xatolik bo'lsa ham asosiy amal (masalan vazifa topshirish) to'xtamasligi
    // uchun xatoni faqat log qilamiz, tashqariga otmaymiz.
    async notifyAdmin(text: string): Promise<void> {
        const chatId = getTelegramAdminId();
        if (!this.bot || !chatId) return;

        try {
            await this.bot.telegram.sendMessage(chatId, text);
        } catch (err) {
            this.logger.error(`Telegram xabar yuborishda xatolik: ${err}`);
        }
    }
}
