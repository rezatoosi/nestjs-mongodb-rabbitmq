import { MiddlewareConsumer, Module } from '@nestjs/common';
import { InvoiceModule } from './invoice/invoice.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import {
  LoggerMiddleware,
  Options as LoggerOptions,
} from './logger/logger.middleware';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    MongooseModule.forRoot(
      process.env.MONGODB_CONNECTOIN_STRING ||
        'mongodb://localhost:27017/invoice-system',
    ),
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
