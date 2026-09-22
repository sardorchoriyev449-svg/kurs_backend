import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Users, UserSchema } from "../users/model/user.model";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";

@Module({
    imports:[
        MongooseModule.forFeature([{name:Users.name, schema:UserSchema}])
    ],
    providers:[AuthService,JwtService],
    controllers:[AuthController]
})
export class AuthModule{}