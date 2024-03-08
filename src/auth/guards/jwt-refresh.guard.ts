import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';

@Injectable()
export default class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  private extractRefreshToken(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
      return authHeader.split(' ')[1];
    }
    return null;
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const refreshToken = this.extractRefreshToken(request);
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const isValid =
      await this.authService.checkIfRefreshTokenValid(refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return true;
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid refresh token');
    }
    return user;
  }
}
