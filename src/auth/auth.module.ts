import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@/users/users.module';
import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from '@/auth/strategies/local.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RefreshTokens,
  RefreshTokensSchema,
} from '@/auth/schemas/refresh-token.schema';
import { RefreshTokenRepository } from '@/auth/repositories/refresh-token.repository';
import { ApiKeyStrategy } from '@/auth/strategies/api-key.strategy';
import { ApiKeyRepository } from '@/auth/repositories/api-key.repository';
import { ApiKey, ApiKeySchema } from '@/auth/schemas/api-key.schema';
import { JwtRefreshTokenStrategy } from '@/auth/strategies/jwt-refresh.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('jwt.jwtSecret'),
          signOptions: {
            expiresIn: configService.get<number>('jwt.accessTokenExpiration'),
          },
        };
      },
    }),
    MongooseModule.forFeature([
      { name: RefreshTokens.name, schema: RefreshTokensSchema },
      { name: ApiKey.name, schema: ApiKeySchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ApiKeyStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    LocalStrategy,
    {
      provide: 'JWT_SIGNER',
      inject: [ConfigService, JwtService],
      useFactory: async (
        configService: ConfigService,
        jwtService: JwtService,
      ) => {
        const jwtRefreshSecret = configService.get<string>(
          'jwt.jwtRefreshSecret',
        );
        const expiresIn = configService.get<number>(
          'jwt.refreshTokenExpiration',
        );
        return (payload: any) =>
          jwtService.sign(payload, {
            secret: jwtRefreshSecret,
            expiresIn: expiresIn,
          });
      },
    },
    RefreshTokenRepository,
    ApiKeyRepository,
  ],
  exports: [AuthService, RefreshTokenRepository, ApiKeyRepository],
})
export class AuthModule {}
