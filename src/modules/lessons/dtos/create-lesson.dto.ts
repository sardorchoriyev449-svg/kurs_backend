import { IsNotEmpty, IsOptional, IsString, IsMongoId, IsDateString } from 'class-validator';

export class CreateLessonDto {
  // Kiritilmasa: mavzu tanlangan bo'lsa o'sha mavzu nomi qo'yiladi
  // (mavzu nomining o'zi darsning nima ekanligini bildiradi).
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

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
