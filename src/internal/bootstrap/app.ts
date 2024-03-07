import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { INestApplication, VersioningType } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { AWSConfigBootstrap } from '@/internal/bootstrap/aws';
import { LoggerBootstrap } from '@/internal/bootstrap/logger';
import { LoggerInterceptor } from '@/internal/common/interceptors/logger.interceptor';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function ServicesBootstrap(app: INestApplication) {
  await LoggerBootstrap(app);
  await AWSConfigBootstrap(app);
}

export async function AppBootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    origin: '*',
    allowedHeaders: ['*'],
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(helmet());
  app.useGlobalInterceptors(new LoggerInterceptor());

  const appPort = configService.get<string>('app.port');
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('Fareati Backend')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'refresh-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await ServicesBootstrap(app);
  await app.listen(appPort);
}
