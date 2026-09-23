import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HomeworkAssignment, HomeworkAssignmentSchema } from "./model/homework-assignment.model";
import { HomeworkAssignmentService } from "./homework-assignment.service";
import { HomeworkAssignmentController } from "./homework-assignment.controller";
import { Group, GroupSchema } from "../groups/model/group.model";
import { Homework, HomeworkSchema } from "../homework/model/homework.model";
import { FreezeModule } from "../freeze/freeze.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: HomeworkAssignment.name, schema: HomeworkAssignmentSchema },
            // Guruh o'quvchilari va topshirilgan javoblarni solishtirish uchun
            // ("kim topshirgan / kim topshirmagan" hisoboti) - shu modelga
            // to'g'ridan-to'g'ri kirish kerak.
            { name: Group.name, schema: GroupSchema },
            { name: Homework.name, schema: HomeworkSchema },
        ]),
        FreezeModule,
    ],
    controllers: [HomeworkAssignmentController],
    providers: [HomeworkAssignmentService],
    exports: [HomeworkAssignmentService],
})
export class HomeworkAssignmentModule {}
