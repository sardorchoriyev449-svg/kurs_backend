import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Course, CourseSchema } from "./model/course.model";
import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";

@Module({
    imports:[
        MongooseModule.forFeature([{name:Course.name, schema:CourseSchema}])
    ],
    controllers:[CourseController],
    providers:[CourseService],
    exports:[CourseService],
})
export class CoursModule{}