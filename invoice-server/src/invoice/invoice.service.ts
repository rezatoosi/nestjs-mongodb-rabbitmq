import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './schema/invoice.schema';
import { CreateInvoiceDto } from './dto/createInvoice.dto';
import { InvoiceListQuery } from './dto/invoiceListQuery.dto';
import { getEndOfDay, getStartOfDay } from 'src/common/dateTime';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
  ) {}

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const { reference } = createInvoiceDto;
    const existingInvoice = await this.invoiceModel.findOne({ reference });
    if (existingInvoice) {
      throw new HttpErrorByCode[400](
        'Invoice with this reference already exists',
      );
    }
    return this.invoiceModel.create(createInvoiceDto);
  }

  getInvoiceList(query: InvoiceListQuery): Promise<Invoice[]> {
    const { startDate, endDate } = query;
    const filter = {};
    if (startDate) {
      filter['date'] = { $gte: getStartOfDay(startDate) };
    }
    if (endDate) {
      filter['date'] = { ...filter['date'], $lte: getEndOfDay(endDate) };
    }

    return this.invoiceModel.find(filter);
  }

  async getInvoiceById(id: string) {
    const invoice = await this.invoiceModel.findById(id);
    if (!invoice) {
      throw new HttpErrorByCode[404]('Invoice not found');
    }
    return invoice;
  }
}
