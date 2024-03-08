import { Config } from '@/internal/config/types';

export default (): Config => {
  return {
    app: {
      env: process.env.NODE_ENV ?? 'development',
      port: Number(process.env.PORT || 4000),
    },
    jwt: {
      jwtSecret: process.env.JWT_SECRET ?? 'secret',
      jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? 'refresh-secret',
      refreshTokenExpiration: Number(
        process.env.REFRESH_TOKEN_EXPIRATION ?? 3600,
      ),
      accessTokenExpiration: Number(
        process.env.ACCESS_TOKEN_EXPIRATION ?? 3600,
      ),
    },
    database: {
      url: process.env.DATABASE_URI ?? 'mongodb://localhost:27017/fareati',
    },
  };
};
