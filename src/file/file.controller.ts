import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Get(':filename')
  findOne(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.fileService.findOne(filename, res);
  }
}
