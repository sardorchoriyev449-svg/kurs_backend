import { PartialType } from "@nestjs/mapped-types";
import { CoursCreateDtos } from "./create.course.dtos";

export class CoursUpdateDtos extends PartialType(CoursCreateDtos){

}