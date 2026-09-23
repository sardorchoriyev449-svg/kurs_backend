import { Module } from "@nestjs/common";
import { TelegramService } from "./telegram.service";
import { BotUpdate } from "./bot.update";
import { TelegramSessionService } from "./telegram-session.service";
import { UsersModule } from "../users/user.module";

@Module({
    imports: [UsersModule],
    providers: [TelegramService, BotUpdate, TelegramSessionService],
    exports: [TelegramService],
})
export class NotificationsModule {}
