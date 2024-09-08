import { Injectable, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { FileType } from './file-type';

@Injectable()
export class FileService {
  async findOne(id: string, res: Response): Promise<StreamableFile> {
    const file = createReadStream(`./uploads/${id}`);

    const mime = await FileType.fromStream(createReadStream(`./uploads/${id}`));
    res.set({ 'Content-Type': mime.mime });
    console.log(mime);
    return new StreamableFile(file);
  }
}
