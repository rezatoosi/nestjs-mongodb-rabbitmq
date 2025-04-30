import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  AsyncOptions,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { loggerInstance } from './logger/logger';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<
    AsyncOptions<MicroserviceOptions>
  >(AppModule, {
    logger: WinstonModule.createLogger({
      instance: loggerInstance,
    }),
    useFactory: (configService: ConfigService) => ({
      transport: Transport.RMQ,
      options: {
        urls: [
          configService.get<string>(
            'RABBITMQ_SERVER_URL',
            'amqp://localhost:5672',
          ),
        ],
        queue: configService.get<string>('RABBITMQ_QUEUE_NAME'),
      },
    }),
    inject: [ConfigService],
  });
  await app.listen();
}
bootstrap();
