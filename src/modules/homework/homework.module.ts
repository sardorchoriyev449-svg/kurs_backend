import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HomeworkController } from "./homework.controller"; 
import { HomeWorkService } from "./homework.service"; 
import { Homework, HomeworkSchema } from "./model/homework.model";
import { UsersModule } from "../users/user.module"; 
import { HomeworkAssignmentModule } from "../homework-assignments/homework-assignment.module";
import { CoinModule } from "../coins/coin.module";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Homework.name, schema: HomeworkSchema }
        ]),
        UsersModule,
        HomeworkAssignmentModule,
        CoinModule,
        NotificationsModule
    ],
    controllers: [
        HomeworkController
    ],
    providers: [
        HomeWorkService
    ],
    exports: [
        HomeWorkService
    ]
})
export class HomeworkModule { }
