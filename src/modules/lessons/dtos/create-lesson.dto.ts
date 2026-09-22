import { IsNotEmpty, IsOptional, IsString, IsMongoId, IsDateString } from 'class-validator';

export class CreateLessonDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsMongoId()
  group_id: string;

  // "O'quv reja bo'yicha" tanlansa shu mavzuga bog'lanadi. "Boshqa" tanlansa
  // yubormaslik kifoya - faqat "name" maydoniga qo'lda yozilgan nom yoziladi.
  @IsOptional()
  @IsMongoId()
  topic_id?: string;

  // Kiritilmasa, backend joriy sanani qo'yadi
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  video_uri?: string;

  @IsOptional()
  @IsString()
  file_uri?: string;
}
