import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PrismaService } from 'src/prisma.service';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
      storage: memoryStorage(),
    }),
  ],
  controllers: [UploadsController],
  providers: [UploadsService, PrismaService, JwtService, ConfigService],
})
export class UploadsModule {}
