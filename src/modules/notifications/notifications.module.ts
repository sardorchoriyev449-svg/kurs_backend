import { Module } from "@nestjs/common";
import { TelegramService } from "./telegram.service";
import { BotUpdate } from "./bot.update";

@Module({
    providers: [TelegramService, BotUpdate],
    exports: [TelegramService],
})
export class NotificationsModule {}
