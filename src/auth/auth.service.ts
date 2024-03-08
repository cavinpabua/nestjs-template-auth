import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PayloadToken, Role } from '@/auth/domain/types';
import { UsersService } from '@/users/users.service';
import { UsersDocument } from '@/users/schemas/users.schema';
import { SchemaId } from '@/internal/types/helpers';
import { RefreshTokenRepository } from '@/auth/repositories/refresh-token.repository';
import { RefreshTokensDocument } from '@/auth/schemas/refresh-token.schema';
import { ApiKeyRepository } from '@/auth/repositories/api-key.repository';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject('JWT_SIGNER') private readonly jwtSigner: (payload: any) => string,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly apiKeyRepository: ApiKeyRepository,
    private configService: ConfigService,
  ) {}

  async createAdmin(dto: CreateUserDto) {
    dto.role = Role.ADMIN;
    return await this.usersService.create(dto);
  }

  async validateUser(email: string, password: string) {
    const user: UsersDocument =
      await this.usersService.findByEmailAndGetPassword(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        delete user.password;
        return user;
      }
    }
    return null;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: SchemaId) {
    const token: RefreshTokensDocument =
      await this.refreshTokenRepository.first({
        userId,
      });

    if (token) {
      return await this.refreshTokenRepository.update(token._id, {
        token: refreshToken,
        isValid: true,
      });
    } else {
      return await this.refreshTokenRepository.store({
        userId,
        token: refreshToken,
      });
    }
  }

  async checkIfRefreshTokenValid(refreshToken: string) {
    const token: RefreshTokensDocument =
      await this.refreshTokenRepository.first({
        token: refreshToken,
      });
    return token?.isValid;
  }

  async login(user: PayloadToken) {
    const { accessToken } = this.jwtToken(user);
    const refreshToken = this.jwtRefreshToken(user);
    await this.setCurrentRefreshToken(refreshToken, user._id);

    return {
      accessToken,
      refreshToken,
    };
  }

  jwtToken(user: PayloadToken) {
    const payload: PayloadToken = { role: user.role, _id: user._id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  jwtTokenFromRefreshToken(token: string) {
    const decoded = this.jwtService.verify(token, {
      secret: this.configService.get<string>('jwt.jwtRefreshSecret'),
    });
    const payload: PayloadToken = { role: decoded.role, _id: decoded._id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  jwtRefreshToken(user: PayloadToken) {
    const payload = { role: user.role, _id: user._id };
    return this.jwtSigner(payload);
  }

  async removeRefreshToken(userId: SchemaId) {
    const token: RefreshTokensDocument =
      await this.refreshTokenRepository.first({ userId });
    return this.refreshTokenRepository.update(token._id, { isValid: false });
  }

  async logout(user: PayloadToken) {
    return await this.removeRefreshToken(user._id);
  }

  async updatePassword(
    user: PayloadToken,
    oldPassword: string,
    newPassword: string,
  ) {
    return await this.usersService.updatePassword(
      user._id,
      oldPassword,
      newPassword,
    );
  }

  private extractRefreshToken(authHeader: string): string | null {
    if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
      return authHeader.split(' ')[1];
    }
    return null;
  }

  async createAccessTokenFromRefreshToken(token: string) {
    return this.jwtTokenFromRefreshToken(this.extractRefreshToken(token));
  }

  async validateApiKey(key: string) {
    return await this.apiKeyRepository.first({ key, isValid: true });
  }
}
