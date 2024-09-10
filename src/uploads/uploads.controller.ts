import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { user } from '@prisma/client';
import { AuthWithRoles } from 'src/auth/auth.decorator';
import { CurrentUser } from 'src/current-user/current-user.decorator';
import { UploadsService } from './uploads.service';

@AuthWithRoles()
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('img'))
  create(@CurrentUser() user: user, @UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.create(user, file);
  }

  @Get(':id')
  findOne(@CurrentUser() user: user, @Param('id') id: string) {
    return this.uploadsService.findOne(+id, user);
  }
}
