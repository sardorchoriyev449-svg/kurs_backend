import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Freeze, FreezeSchema } from "./model/freeze.model";
import { FreezeService } from "./freeze.service";
import { FreezeController } from "./freeze.controller";

@Module({
    imports:[
        MongooseModule.forFeature([
            {name:Freeze.name, schema:FreezeSchema}
        ]),
    ],
    controllers:[FreezeController],
    providers:[FreezeService],
    exports:[FreezeService],
})
export class FreezeModule{}
