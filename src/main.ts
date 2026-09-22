import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser'
import { getCookieToken } from './common/configs/cookie-token.config';
import { ValidationPipe } from '@nestjs/common';
import { getCorsHost } from './common/configs/cors.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser(getCookieToken()))

  app.useStaticAssets(join(__dirname, '..','uploads'), {
    prefix:'/uploads/'
  })

  app.enableCors({
    origin: (getCorsHost()).split(','),
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    transform:true,
    whitelist:true,
    forbidNonWhitelisted:true
  }))

  const port = process.env.PORT ?? 3000
  await app.listen(port,()=>{
    console.log(`localhost:${port}`);
  });
}
bootstrap();
