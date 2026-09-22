import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CourseService } from "./course.service";
import { ObjectId, Types } from "mongoose";
import { CoursCreateDtos } from "./dtos/create.course.dtos";
import { CoursUpdateDtos } from "./dtos/update.course.dtos";

@Controller('course')
export class CourseController{
    constructor(
        private readonly service:CourseService
    ){}

    @Get()
    async getAll(){
        return await this.service.getAll()
    }
    @Post()
    async create(@Body() dtos:CoursCreateDtos){
        return await this.service.create(dtos)
    }
    @Put('update/:id')
    async update(@Param('id') id:Types.ObjectId, @Body() dtos:CoursUpdateDtos){
        return await this.service.update(id,dtos)
    }
    @Get(':id')
    async getOne(@Param('id') id:Types.ObjectId){
        return await this.service.getOne(id)
    }
    @Delete(':id')
    async delete(@Param('id') id:Types.ObjectId){
        return await this.service.delete(id)
    }
}