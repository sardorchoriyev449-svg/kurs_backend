import {
    BadRequestException,
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { AuthGuard } from "../../common/guards/auth.guard";
import { Protected } from "../../common/guards/protected.guard";
import { UploadService } from "./uploads.service";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

@Controller("upload")
@UseGuards(AuthGuard)
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post()
    @Protected()
    @UseInterceptors(
        FileInterceptor("file", {
            storage: memoryStorage(),
            limits: { fileSize: MAX_FILE_SIZE },
            fileFilter: (_req, file, callback) => {
                if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
                    callback(new BadRequestException("Faqat rasm fayllari (jpg, png, webp, gif) qabul qilinadi"), false);
                    return;
                }
                callback(null, true);
            },
        }),
    )
    async upload(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            return { success: false, message: "Fayl yuborilmadi" };
        }

        const url = await this.uploadService.uploadFile(file);

        return {
            success: true,
            message: "Fayl muvaffaqiyatli yuklandi!",
            data: { url },
        };
    }
}