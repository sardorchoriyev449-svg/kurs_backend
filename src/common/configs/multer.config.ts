import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads', 
    filename: (req, file, callback) => {
      
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  fileFilter: (req: any, file: any, callback: any) => {
    // Rasm, video, hujjat va arxiv (masalan o'qituvchi namuna loyihasi) turlariga ruxsat.
    // Ba'zi brauzerlar .zip uchun turlicha mimetype yuboradi
    // (application/zip, application/x-zip-compressed, application/octet-stream),
    // shuning uchun mimetype o'rniga fayl kengaytmasi bo'yicha tekshiramiz - ishonchliroq.
    const allowedExt = /\.(jpg|jpeg|png|gif|mp4|mkv|mov|webm|avi|pdf|doc|docx|zip|rar|7z)$/i;
    if (allowedExt.test(file.originalname)) {
      callback(null, true);
    } else {
      callback(new BadRequestException("Ruxsat berilmagan fayl formati!"), false);
    }
  },
};