import {
  CanActivate,
  ContextType,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { user } from '@prisma/client';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { AUTH_KEY } from './auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>(AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const requestType: ContextType = context.getType();

    if (requestType === 'http') {
      const httpContext = context.switchToHttp();
      const req = httpContext.getRequest<Request>();
      const res = httpContext.getResponse<Response>();

      const authorization =
        req.headers.authorization ?? (req.headers.Authorization as string);

      if (!authorization) {
        throw new HttpException('Unauthorized.', HttpStatus.UNAUTHORIZED);
      }

      const token: string = authorization.split(' ')[1];

      try {
        const payload = this.jwtService.verify<user>(token, {
          secret: this.configService.get<string>('ACCESS_TOKEN_KEY'),
        });
        res.locals.user = payload;

        return !roles || !roles.length || roles.includes(payload.role);
      } catch {
        throw new HttpException('Invalid token.', HttpStatus.UNAUTHORIZED);
      }
    } else {
      return false;
    }
  }
}
