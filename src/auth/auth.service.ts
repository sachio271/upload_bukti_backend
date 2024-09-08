import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { user } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { LoginResponseDto } from './dto/response/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async create(createAuthDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.prismaService.user.findUnique({
      where: { ektp: createAuthDto.ektp },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (user.password !== createAuthDto.password) {
      throw new UnauthorizedException('Invalid password');
    }
    const [accessToken, refreshToken] = await this.generateTokens(user);
    await this.prismaService.refreshtoken.create({
      data: {
        token: refreshToken,
        userId: user.id,
      },
    });
    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  generateTokens(user: user): Promise<[string, string]> {
    const payload = { id: user.id, ektp: user.ektp, role: user.role };
    return Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('ACCESS_TOKEN_KEY'),
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRE'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_KEY'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRE'),
      }),
    ]);
  }

  async logout(logoutDto: LogoutDto, currentUser: user): Promise<void> {
    const refreshToken = await this.prismaService.refreshtoken.findFirst({
      where: {
        token: logoutDto.refreshToken,
        userId: currentUser.id,
      },
    });
    console.log(refreshToken);

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid credentials');
    }
    await this.prismaService.refreshtoken.deleteMany({
      where: {
        token: logoutDto.refreshToken,
      },
    });
  }

  async refreshTokens(logoutDto: LogoutDto): Promise<LoginResponseDto> {
    const token = await this.prismaService.refreshtoken.findFirst({
      where: {
        token: logoutDto.refreshToken,
      },
    });
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }
    const user = await this.prismaService.user.findUnique({
      where: {
        id: token.userId,
      },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const [newAccessToken] = await this.generateTokens(user);
    return {
      accessToken: newAccessToken,
      refreshToken: token.token,
      user: user,
    };
  }
}
