import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AsyncOptions, MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<AsyncOptions<MicroserviceOptions>>(
    AppModule,
    {
      useFactory: (configService: ConfigService) => (
        {
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_SERVER_URL', 'amqp://localhost:5672')],
            queue: configService.get<string>('daily_sales_report'),
          },
        }
      ),
      inject: [ConfigService]
    }
  );
  await app.listen();
}
bootstrap();
