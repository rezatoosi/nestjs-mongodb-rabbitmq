import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import AppDb from '../app.db';

@Module({
  imports: [
    MongooseModule.forFeature(AppDb),
  ],
  providers: [InvoiceService],
  controllers: [InvoiceController]
})
export class InvoiceModule {}
