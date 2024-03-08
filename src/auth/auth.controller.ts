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
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GetRefreshResponse,
  LoginDto,
  PostLoginResponse,
} from '@/auth/dto/login.dto';
import { UpdatePasswordDto } from '@/auth/dto/update-password.dto';
import JwtRefreshGuard from '@/auth/guards/jwt-refresh.guard';
import { PayloadToken } from '@/auth/domain/types';
import { AuthService } from '@/auth/auth.service';
import { Public } from '@/internal/common/decorators/public.decorator';
import { LocalAuthGuard } from '@/auth/guards/local-auth.guard';
import { IsApiKeyOnly } from '@/internal/common/decorators/api-key-only.decorator';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';

type AuthorizedRequest = Express.Request & {
  headers: { authorization: string };
  user: PayloadToken;
};

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: CreateUserDto })
  @IsApiKeyOnly()
  @UsePipes(ValidationTransformPipe)
  @Post('create-admin')
  createAdmin(@Body() dto: CreateUserDto) {
    return this.authService.createAdmin(dto);
  }

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
  @Post('logout')
  async logout(@Request() req: { user: PayloadToken }) {
    return await this.authService.logout(req.user);
  }

  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse({ status: 200 })
  @ApiBearerAuth('access-token')
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
  @Public()
  @Post('refresh')
  refresh(@Request() req: AuthorizedRequest) {
    const token = req.headers.authorization;
    return this.authService.createAccessTokenFromRefreshToken(token);
  }
}
