import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { MongooseModule } from '@nestjs/mongoose';
import appDb from 'src/app.db';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature(appDb),
    ScheduleModule.forRoot(),
    ClientsModule.registerAsync([
      {
        name: 'INVOICE_SERVICE',
        useFactory: (configService: ConfigService) => ({
          name: 'rabbit',
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_SERVER_URL', '')],
            queue: configService.get<string>('RABBITMQ_QUEUE_NAME'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule { }
