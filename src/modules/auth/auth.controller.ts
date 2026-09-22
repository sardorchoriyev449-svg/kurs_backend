import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import type { Response } from 'express'
import { SignInDtos } from "./dtos/sign-in.dtos";
import { RequestWithUser } from "../../common/guards/user-request.guard";
import { Protected } from "../../common/guards/protected.guard";

@Controller('auth')
export class AuthController{
    constructor(
        private readonly service:AuthService,
    ){}

    @Post('sign-in')
    async signIn(@Body() dtos:SignInDtos,@Res({ passthrough: true }) res:Response){
        return await this.service.signIn(dtos,res)
    }
    @Post('logout')
    async logout(@Res({ passthrough: true }) res:Response){
        return await this.service.logOut(res)
    }
    @Get('me')
    @Protected()
    async getMe(@Req() req:RequestWithUser){
        return await this.service.getMe(req)
    }
    
}