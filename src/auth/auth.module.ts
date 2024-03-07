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
            expiresIn: configService.get('jwt.accessTokenExpiration'),
          },
        };
      },
    }),
    MongooseModule.forFeature([
      { name: RefreshTokens.name, schema: RefreshTokensSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    {
      provide: 'JWT_SIGNER',
      inject: [ConfigService, JwtService],
      useFactory: async (
        configService: ConfigService,
        jwtService: JwtService,
      ) => {
        const jwtSecret = configService.get<string>('auth.jwtRefreshSecret');
        const expiresIn = configService.get<string>(
          'auth.refreshTokenExpiration',
        );
        return (payload: any) =>
          jwtService.sign(payload, {
            secret: jwtSecret,
            expiresIn: expiresIn,
          });
      },
    },
    RefreshTokenRepository,
  ],
})
export class AuthModule {}
