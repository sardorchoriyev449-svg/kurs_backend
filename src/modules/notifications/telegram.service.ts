import { Injectable, Logger } from "@nestjs/common";
import { getTelegramAdminId, getTelegramBotToken } from "../../common/configs/telegram.config";

@Injectable()
export class TelegramService {
    private readonly logger = new Logger(TelegramService.name);

    // Xatolik bo'lsa ham asosiy amal (masalan vazifa topshirish) to'xtamasligi
    // uchun xatoni faqat log qilamiz, tashqariga otmaymiz.
    async notifyAdmin(text: string): Promise<void> {
        const token = getTelegramBotToken();
        const chatId = getTelegramAdminId();
        if (!token || !chatId) return;

        try {
            const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text }),
            });

            if (!res.ok) {
                const body = await res.text();
                this.logger.error(`Telegram xabar yuborilmadi: ${res.status} ${body}`);
            }
        } catch (err) {
            this.logger.error(`Telegram xabar yuborishda xatolik: ${err}`);
        }
    }
}
