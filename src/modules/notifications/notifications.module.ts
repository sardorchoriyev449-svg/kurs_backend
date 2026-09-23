import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TelegramService } from "./telegram.service";
import { BotUpdate } from "./bot.update";
import { TelegramSessionService } from "./telegram-session.service";
import { BotCommandsService } from "./bot-commands.service";
import { UsersModule } from "../users/user.module";
import { GradeModule } from "../grades/grade.module";
import { CoinModule } from "../coins/coin.module";
import { Group, GroupSchema } from "../groups/model/group.model";
import { HomeworkAssignment, HomeworkAssignmentSchema } from "../homework-assignments/model/homework-assignment.model";
import { Homework, HomeworkSchema } from "../homework/model/homework.model";

@Module({
    imports: [
        UsersModule,
        GradeModule,
        CoinModule,
        // HomeworkAssignmentModule'ni to'g'ridan-to'g'ri import qilmaymiz -
        // u NotificationsModule'ni import qiladi, aylanma bog'lanish
        // bo'lmasligi uchun kerakli modellarga bevosita ulanamiz.
        MongooseModule.forFeature([
            { name: Group.name, schema: GroupSchema },
            { name: HomeworkAssignment.name, schema: HomeworkAssignmentSchema },
            { name: Homework.name, schema: HomeworkSchema },
        ]),
    ],
    providers: [TelegramService, BotUpdate, TelegramSessionService, BotCommandsService],
    exports: [TelegramService],
})
export class NotificationsModule {}
