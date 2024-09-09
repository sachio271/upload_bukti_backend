import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prismaService: PrismaService) {}
  accept(id: number) {
    const data = this.prismaService.uploads.update({
      where: {
        id: id,
      },
      data: {
        is_accept: true,
      },
    });
    return data;
  }

  async findAllPost() {
    const data = await this.prismaService.uploads.findMany();
    return data.map((item) => {
      return {
        ...item,
        filename:
          'http://localhost:3000/file/' + item.filename.split('/').pop(),
      };
    });
  }

  async findOnePost(id: number) {
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
