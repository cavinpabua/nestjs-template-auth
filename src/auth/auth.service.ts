import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PayloadToken } from '@/auth/domain/types';
import { UsersService } from '@/users/users.service';
import { UsersDocument } from '@/users/schemas/users.schema';
import { SchemaId } from '@/internal/types/helpers';
import { createHash } from 'crypto';
import { RefreshTokenRepository } from '@/auth/repositories/refresh-token.repository';
import { RefreshTokensDocument } from '@/auth/schemas/refresh-token.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    @Inject('JWT_SIGNER') private readonly jwtSigner: (payload: any) => string,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

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
    const hash = createHash('sha256').update(refreshToken).digest('hex');
    const currentHashedRefreshToken = await bcrypt.hashSync(hash, 10);
    const token: RefreshTokensDocument =
      await this.refreshTokenRepository.first({
        userId,
      });

    if (token) {
      return await this.refreshTokenRepository.update(token._id, {
        refreshToken: currentHashedRefreshToken,
        isValid: true,
      });
    } else {
      return await this.refreshTokenRepository.store({
        userId,
        refreshToken: currentHashedRefreshToken,
      });
    }
  }

  async checkIfRefreshTokenValid(refreshToken: string) {
    const hash = createHash('sha256').update(refreshToken).digest('hex');
    const currentHashedRefreshToken = await bcrypt.hashSync(hash, 10);
    const token: RefreshTokensDocument =
      await this.refreshTokenRepository.first({
        refreshToken: currentHashedRefreshToken,
      });
    return token.isValid;
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
      accessToken: this.jwtSigner(payload),
    };
  }

  jwtRefreshToken(user: PayloadToken) {
    const payload = { role: user.role, _id: user._id };
    return this.jwtSigner(payload);
  }

  async removeRefreshToken(userId: SchemaId) {
    const token: RefreshTokensDocument =
      await this.refreshTokenRepository.first({ userId });
    return this.refreshTokenRepository.delete(token._id);
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

  async createAccessTokenFromRefreshToken(user: PayloadToken) {
    return this.jwtToken(user);
  }
}
