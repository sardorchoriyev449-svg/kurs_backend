import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { InjectBot } from "nestjs-telegraf";
import { Telegraf } from "telegraf";
import { getTelegramAdminId } from "../../common/configs/telegram.config";

const LAUNCH_RETRY_DELAY_MS = 15000;

@Injectable()
export class TelegramService implements OnApplicationBootstrap, OnApplicationShutdown {
    private readonly logger = new Logger(TelegramService.name);

    constructor(@InjectBot() private readonly bot: Telegraf) {}

    // Botni shu yerda o'zimiz, xatoni tutib, ishga tushiramiz (app.module.ts'da
    // launchOptions:false qilingan). Telegram serveriga ulanishda vaqtincha
    // xato bo'lsa (masalan tarmoq sekinligi), butun backend yiqilib ketmasin
    // deb - shunchaki log qilib, biroz kutib qayta urinamiz.
    async onApplicationBootstrap() {
        this.launchWithRetry();
    }

    async onApplicationShutdown() {
        try {
            this.bot.stop();
        } catch {}
    }

    private async launchWithRetry(attempt = 1): Promise<void> {
        try {
            await this.bot.launch();
            this.logger.log('Telegram bot ishga tushdi.');
        } catch (err) {
            this.logger.error(`Telegram botni ishga tushirib bo'lmadi (${attempt}-urinish): ${err}`);
            setTimeout(() => this.launchWithRetry(attempt + 1), LAUNCH_RETRY_DELAY_MS);
        }
    }

    // Xatolik bo'lsa ham asosiy amal (masalan vazifa topshirish) to'xtamasligi
    // uchun xatoni faqat log qilamiz, tashqariga otmaymiz.
    async notifyAdmin(text: string): Promise<void> {
        const chatId = getTelegramAdminId();
        if (!chatId) return;

        await this.sendToChat(chatId, text);
    }

    // Har qanday (Telegram bot orqali tizimga kirgan) foydalanuvchiga xabar yuborish.
    async sendToChat(chatId: string, text: string): Promise<void> {
        if (!chatId) return;

        try {
            await this.bot.telegram.sendMessage(chatId, text);
        } catch (err) {
            this.logger.error(`Telegram xabar yuborishda xatolik (${chatId}): ${err}`);
        }
    }
}
