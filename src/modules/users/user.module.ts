import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Users, UserSchema } from "./model/user.model";
import { UsersService } from "./user.service";
import { UsersController } from "./user.controller";

@Module({
    imports:[MongooseModule.forFeature([{name:Users.name, schema:UserSchema}])],
    providers:[UsersService],
    controllers:[UsersController],
    exports:[UsersService],
})
export class UsersModule{}