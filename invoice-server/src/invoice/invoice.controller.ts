import { Controller, Get, Post } from '@nestjs/common';

@Controller('invoices')
export class InvoiceController {
    @Post()
    createInvoice() {}

    @Get()
    getInvoiceList() {
        return 'ok';
    }

    @Get(':id')
    getInvoiceById() {}
}
