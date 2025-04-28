import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/createInvoice.dto';
import { InvoiceService } from './invoice.service';
import { InvoiceListQueryDto } from './dto/invoiceListQuery.dto';
import { Types } from 'mongoose';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.createInvoice(createInvoiceDto);
  }

  @Get()
  getInvoiceListByDate(@Query() query: InvoiceListQueryDto) {
    return this.invoiceService.getInvoiceList(query);
  }

  @Get(':id')
  getInvoiceById(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpErrorByCode[400]('Invalid ID format');
    }
    return this.invoiceService.getInvoiceById(id);
  }
}
