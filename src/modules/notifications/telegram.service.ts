import { Injectable, Logger } from "@nestjs/common";
import { InjectBot } from "nestjs-telegraf";
import { Telegraf } from "telegraf";
import { getTelegramAdminId } from "../../common/configs/telegram.config";

@Injectable()
export class TelegramService {
    private readonly logger = new Logger(TelegramService.name);

    constructor(@InjectBot() private readonly bot: Telegraf) {}

    // Xatolik bo'lsa ham asosiy amal (masalan vazifa topshirish) to'xtamasligi
    // uchun xatoni faqat log qilamiz, tashqariga otmaymiz.
    async notifyAdmin(text: string): Promise<void> {
        const chatId = getTelegramAdminId();
        if (!chatId) return;

        try {
            await this.bot.telegram.sendMessage(chatId, text);
        } catch (err) {
            this.logger.error(`Telegram xabar yuborishda xatolik: ${err}`);
        }
    }
}
