import { useContainer } from 'class-validator';
import * as rateLimit from 'fastify-rate-limit';
import * as helmet from 'helmet';

import {
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) =>
        new UnprocessableEntityException(errors, 'Validation Error')
    })
  );
  app.enableCors();
  app.use(helmet());
  app.register(rateLimit, {
    max: 150,
    timeWindow: 1000 * 60 * 5
  });

  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      url: 'redis://localhost:6379'
    }
  });

  await app.startAllMicroservicesAsync();
  await app.listen(
    configService.get('SERVICE_PORT'),
    configService.get('SERVICE_HOST')
  );
}
bootstrap();
