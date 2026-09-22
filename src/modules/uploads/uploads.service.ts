import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadsService {
  
  handleFileUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("Fayl yuklanmadi!");
    }

    return {
      success: true,
      message: "Fayl muvaffaqiyatli yuklandi!",
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: `/uploads/${file.filename}` 
      }
    };
  }
}