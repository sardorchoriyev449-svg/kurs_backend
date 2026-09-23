import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import cookieParser from 'cookie-parser';
import { getCookieToken } from '../src/common/configs/cookie-token.config';
import { ValidationPipe } from '@nestjs/common';
import { getCorsHost } from '../src/common/configs/cors.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Express } from 'express';

let cachedServer: Express;

async function createNestServer(): Promise<Express> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser(getCookieToken()));

  app.enableCors({
    origin: (getCorsHost() || '').split(','),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.init();
  return app.getHttpAdapter().getInstance();
}

export default async function handler(req: any, res: any) {
  if (!cachedServer) {
    cachedServer = await createNestServer();
  }
  return cachedServer(req, res);
}