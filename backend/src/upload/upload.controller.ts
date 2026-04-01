import {
  Controller,
  Post,
  Delete,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp|gif)$/i }),
          new MaxFileSizeValidator({ maxSize: 20 * 1024 * 1024 }), // 20MB
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.uploadService.uploadImage(file);
  }

  @Delete('images')
  @UseGuards(JwtAuthGuard)
  async deleteImages(@Body() body: { urls: string[] }) {
    await this.uploadService.deleteImages(body.urls);
  }
}
