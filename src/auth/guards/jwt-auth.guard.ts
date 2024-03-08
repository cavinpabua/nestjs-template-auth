import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from '@/internal/common/decorators/public.decorator';
import { API_KEY_PREFIX } from '@/auth/constants/keys';

const HTTP_STATUS_TOKEN_EXPIRED = 498;

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const authorization: string =
      request.query?.apiKey || request.headers.authorization;
    if (authorization?.toLowerCase()?.startsWith(API_KEY_PREFIX)) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (info instanceof jwt.TokenExpiredError) {
      throw new HttpException('Token expired', HTTP_STATUS_TOKEN_EXPIRED);
    }

    if (err || !user) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized user',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
