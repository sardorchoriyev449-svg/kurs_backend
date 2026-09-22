import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  UseGuards 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { multerOptions } from '../../common/configs/multer.config';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Protected } from '../../common/guards/protected.guard';

@Controller('uploads')
@Protected()
@UseGuards(AuthGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadSingleFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.handleFileUpload(file);
  }
}