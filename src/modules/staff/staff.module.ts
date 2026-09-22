import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Staff, StaffSchema } from "./model/staff.model";
import { StaffService } from "./staff.service";
import { StaffController } from "./staff.controller";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Staff.name, schema: StaffSchema }])
    ],
    controllers: [StaffController],
    providers: [StaffService],
    exports: [StaffService],
})
export class StaffModule {}
