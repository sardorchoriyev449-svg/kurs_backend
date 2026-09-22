import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Grade, GradeSchema } from "./model/grade.model";
import { GradeService } from "./grade.service";
import { GradeController } from "./grade.controller";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Grade.name, schema: GradeSchema }])
    ],
    controllers: [GradeController],
    providers: [GradeService],
    exports: [GradeService],
})
export class GradeModule {}
