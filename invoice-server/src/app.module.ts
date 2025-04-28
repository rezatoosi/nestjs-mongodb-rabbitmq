import { MiddlewareConsumer, Module } from '@nestjs/common';
import { InvoiceModule } from './invoice/invoice.module';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import {
  LoggerMiddleware,
  Options as LoggerOptions,
} from './logger/logger.middleware';
import { ReportModule } from './report/report.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    WinstonModule.forRoot(LoggerOptions),
    InvoiceModule,
    ReportModule,
  ],
  controllers: [],
  providers: [LoggerMiddleware],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
