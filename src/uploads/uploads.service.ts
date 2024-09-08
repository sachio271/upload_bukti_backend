import { Injectable } from '@nestjs/common';
import { user } from '@prisma/client';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UploadsService {
  constructor(private prismaService: PrismaService) {}
  async create(user: user, file: Express.Multer.File) {
    console.log(user);
    console.log(file);
    let total = await this.prismaService.uploads.count({
      where: {
        user_id: user.id,
      },
    });
    total = total + 1;
    const name =
      'IMG' + total + user.ektp + '.' + file.originalname.split('.').pop();
    const fileName = `./uploads/${name}`;
    if (!existsSync('./uploads')) {
      mkdirSync('./uploads');
    }
    writeFileSync(fileName, file.buffer);
    const data = await this.prismaService.uploads.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        filename: fileName,
      },
    });
    return {
      ...data,
      filename: 'http://localhost:3000/file/' + fileName.split('/').pop(),
    };
  }

  async findAll() {
    const data = await this.prismaService.uploads.findMany();
    return data.map((item) => ({
      ...item,
      filename: 'http://localhost:3000/file/' + item.filename.split('/').pop(),
    }));
  }

  async findOne(id: number) {
    const data = await this.prismaService.uploads.findUnique({
      where: {
        id: id,
      },
    });
    return {
      ...data,
      filename: 'http://localhost:3000/file/' + data.filename.split('/').pop(),
    };
  }
}
