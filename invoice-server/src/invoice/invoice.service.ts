import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './schema/invoice.schema';
import { CreateInvoiceDto } from './dto/createInvoice.dto';

@Injectable()
export class InvoiceService {
    constructor(@InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>) {}

    createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
        return this.invoiceModel.create(createInvoiceDto);
    }

    getInvoiceList(): Promise<Invoice[]> {
        return this.invoiceModel.find();
    }

    getInvoiceById(id: string) {
        return this.invoiceModel.findById(id);
    }

}
