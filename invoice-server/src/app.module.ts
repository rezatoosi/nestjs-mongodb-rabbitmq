import { Module } from '@nestjs/common';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
  imports: [
    
    InvoiceModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
