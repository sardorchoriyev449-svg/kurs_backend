import { IsNotEmpty, IsNumber, IsString, IsArray, IsMongoId, IsOptional } from 'class-validator';

export class CreateClassRoomDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  size: number;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  group_id?: string[];
}