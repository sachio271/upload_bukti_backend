import { Body, Controller, Post } from '@nestjs/common';
import { user } from '@prisma/client';
import { CurrentUser } from 'src/current-user/current-user.decorator';
import { AuthWithRoles } from './auth.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: LoginDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('logout')
  @AuthWithRoles()
  logout(@CurrentUser() user: user, @Body() logoutDto: LogoutDto) {
    return this.authService.logout(logoutDto, user);
  }

  @Post('refresh')
  refresh(@Body() logoutDto: LogoutDto) {
    return this.authService.refreshTokens(logoutDto);
  }
}
