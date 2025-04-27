import { Module } from '@nestjs/common';
import { InvoiceModule } from './invoice/invoice.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    MongooseModule.forRoot(process.env.MONGODB_CONNECTOIN_STRING || 'mongodb://localhost:27017/invoice-system'),
    InvoiceModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
