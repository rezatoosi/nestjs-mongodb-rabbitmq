import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/createInvoice.dto';
import { InvoiceService } from './invoice.service';

@Controller('invoices')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) {}

    @Post()
    createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
        return this.invoiceService.createInvoice(createInvoiceDto);
    }

    @Get()
    getInvoiceList() {
        return this.invoiceService.getInvoiceList();
    }

    @Get(':id')
    getInvoiceById(@Param('id') id: string) {
        return this.invoiceService.getInvoiceById(id);
    }
}
