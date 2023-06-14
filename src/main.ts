import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ExceptionLoggerFilter } from './utils/exceptionsLogger.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }))

  // const {httpAdapter} = app.get(HttpAdapterHost)
  // app.useGlobalFilters(new ExceptionLoggerFilter (httpAdapter))

  app.use(cookieParser())
  await app.listen(3000);
}
bootstrap();
