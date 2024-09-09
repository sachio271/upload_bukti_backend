import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { UploadsModule } from './uploads/uploads.module';
import { FileModule } from './file/file.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UploadsModule,
    FileModule,
    AdminModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
