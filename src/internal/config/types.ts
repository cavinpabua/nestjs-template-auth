type App = {
  env: string;
  port: number;
};

type JWT = {
  jwtSecret: string;
  jwtRefreshSecret: string;
  refreshTokenExpiration: number;
  accessTokenExpiration: number;
};

type DATABASE = {
  url: string;
};

export type Config = {
  app: App;
  jwt: JWT;
  database: DATABASE;
};
