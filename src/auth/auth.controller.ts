import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GetRefreshResponse,
  LoginDto,
  PostLoginResponse,
} from '@/auth/dto/login.dto';
import { UpdatePasswordDto } from '@/auth/dto/update-password.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import JwtRefreshGuard from '@/auth/guards/jwt-refresh.guard';
import { PayloadToken } from '@/auth/domain/types';
import { AuthService } from '@/auth/auth.service';
import { Public } from '@/internal/common/decorators/public.decorator';
import { LocalAuthGuard } from '@/auth/guards/local-auth.guard';

type AuthorizedRequest = Express.Request & {
  headers: { authorization: string };
  user: PayloadToken;
};

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @ApiResponse({ type: PostLoginResponse, status: 200 })
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  login(@Request() req: { user: PayloadToken }) {
    const user = req.user;
    return this.authService.login(user);
  }

  @ApiResponse({ status: 200 })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logOut(@Request() req: { user: PayloadToken }) {
    await this.authService.logout(req.user);
  }

  // Update password
  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse({ status: 200 })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch('password')
  async updatePassword(
    @Req() req: AuthorizedRequest,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    await this.authService.updatePassword(
      req.user,
      updatePasswordDto.oldPassword,
      updatePasswordDto.newPassword,
    );
  }

  @ApiResponse({ status: 200, type: GetRefreshResponse })
  @ApiBearerAuth('refresh-token')
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() req: AuthorizedRequest) {
    return this.authService.createAccessTokenFromRefreshToken(req.user);
  }
}
