import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./user.service";
import type { ObjectId, Types } from "mongoose";
import { CreateUserDtos } from "./dtos/user.create.dtos";
import { UserUpdateDtos } from "./dtos/users.update.dtos";
import { UserRoleUpdateDtos } from "./dtos/user.role.update.dtos";
import { Protected } from "../../common/guards/protected.guard";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RequestWithUser, RolesGuard } from "../../common/guards/user-request.guard";
import { UserRoles } from "../../common/guards/user-roles.guard";

@Controller(`users`)
@Protected()
@UseGuards(AuthGuard, RolesGuard)
export class UsersController{
    constructor(
        private readonly service:UsersService,
    ){}

    @Get()
    async getAll(){
        return await this.service.getAll()
    }
    @Get('students')
    async getAllStudents(){
        return await this.service.getAllStudents()
    }
    @Post()
    async create(@Body() dtos:CreateUserDtos){
        return await this.service.create(dtos)
    }

    @Put('update/:id')
    async update(@Body() dtos:UserUpdateDtos, @Param('id') id:ObjectId){
        return await this.service.update(dtos,id)
    }

    @Put(':id/role')
    @Protected()
    async roleUpdate(
        @Param('id') id: string,
        @Body() dto: UserRoleUpdateDtos,
        @Req() req: RequestWithUser,
    ) {
        return await this.service.roleUpdate(id, dto, req.user.id);
    }

    @Get(':id')
    async getOne(@Param('id') id:Types.ObjectId | string){
        return await this.service.getOne(id)
    }

    @Delete(':id')
    async delete(@Param('id') id:ObjectId ){
        return await this.service.delete(id)
    }
}
