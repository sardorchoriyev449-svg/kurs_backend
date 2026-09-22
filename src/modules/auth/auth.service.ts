import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Users } from "../users/model/user.model";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import bcrypt from 'bcrypt'
import { UserRoles } from "../../common/guards/user-roles.guard";
import { getAccessTime, getAccessToken, getRefreshTime, getRefreshToken } from "../../common/configs/token.configs";
import type { Response } from 'express'
import { getAdminLogin, getAdminPass } from "../../common/configs/admin.config";
import { SignInDtos } from "./dtos/sign-in.dtos";
import { RequestWithUser } from "../../common/guards/user-request.guard";

@Injectable()
export class AuthService{
    constructor(
        @InjectModel(Users.name) private readonly model:Model<Users>,
        private readonly JwtService:JwtService
    ){}

    async signIn(dtos:SignInDtos, res:Response){
        const data = await this.model.findOne({role:UserRoles.admin})        
        if(!data) await this.AdminSeed();

        const user = await this.model.findOne({login:dtos.login})

        if(!user) return { success:false, message:`Bunday login yoq!` }
        
        const isSame = await this.ComparePass(dtos.password,user.password)
        
        if(!isSame) return {success:false, message:`Parol xato kiritilgan!`}
        
        const accessToken = await this.AccessGenerateToken({id:user._id, role:user.role})
        const refreshToken = await this.RefreshGenerateToken({id:user._id, role:user.role})
        
        res.cookie('accessToken',accessToken,{
            signed:true,
            httpOnly:true,
            maxAge: 15 * 60 * 1000,
        })
        res.cookie('refreshToken',refreshToken,{
            signed:true,
            httpOnly:true,
            maxAge: 15 * 24 * 60 * 60 * 1000,
        })

        return {
            success:true,
            message:`Login mufaqayatliy o'tildi!`
        }

    }

    async logOut(res:Response){
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        return;
    }
    async AdminSeed(){
        const heshpass = await this.HeshPass(getAdminPass())
        await this.model.create({
            first_name:'admin',
            last_name:'',
            login:getAdminLogin(),
            password:heshpass,
            role:UserRoles.superAdmin,
        })
        return;
    }
    
    async getMe(req:RequestWithUser){
        const me = await this.model.findOne({_id:req.user.id}).select('-password')
        if(!me) return {success:false, message:`Faydalanuvchi topilmadi!`}

        return {
            success:true,
            data:me
        }
    }

    private async HeshPass(pass:string){
        const heshpass = bcrypt.hashSync(pass, 10)
        return heshpass;
    }
    private async ComparePass(pass:string, org:string){
        return await bcrypt.compare(pass, org)
    }

    private async AccessGenerateToken(payload:any):Promise<string>{
        const token = await this.JwtService.signAsync(payload,{
            secret:getAccessToken(),
            expiresIn:getAccessTime(),
        })
        return token
    }

    private async RefreshGenerateToken(payload:any):Promise<string>{
        const token = await this.JwtService.signAsync(payload,{
            secret:getRefreshToken(),
            expiresIn:getRefreshTime() as any,
        })
        return token
    }

}