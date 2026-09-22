import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Attendance, AttendanceSchema } from "./model/attendance.model";
import { AttendanceService } from "./attendance.service";
import { AttendanceController } from "./attendance.controller";
import { CoinModule } from "../coins/coin.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Attendance.name, schema: AttendanceSchema }]),
        CoinModule,
    ],
    controllers: [AttendanceController],
    providers: [AttendanceService],
    exports: [AttendanceService],
})
export class AttendanceModule {}
