import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './schema/invoice.schema';
import { CreateInvoiceDto } from './dto/createInvoice.dto';
import { InvoiceListQueryDto } from './dto/invoiceListQuery.dto';
import { getEndOfDay, getStartOfDay, isValidDate } from 'src/common/dateTime';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
  ) { }

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const { reference } = createInvoiceDto;
    const existingInvoice = await this.invoiceModel.findOne({ reference });
    if (existingInvoice) {
      throw new BadRequestException(
        'Invoice with this reference already exists',
      );
    }
    return this.invoiceModel.create(createInvoiceDto);
  }

  getInvoiceList(query: InvoiceListQueryDto): Promise<Invoice[]> {
    const { startDate, endDate } = query;
    const filter: {
      date?: {
        $gte?: string | Date,
        $lte?: string | Date,
      },
    } = {};

    if (startDate) {
      if (!isValidDate(startDate)) {
        throw new BadRequestException('Invalid start date. Date should be in this format \'YYYY-MM-DD\'');
      }
      filter['date'] = { $gte: getStartOfDay(startDate) };
    }
    if (endDate) {
      if (!isValidDate(endDate)) {
        throw new BadRequestException('Invalid end date. Date should be in this format \'YYYY-MM-DD\'')
      }
      filter['date'] = { ...filter['date'], $lte: getEndOfDay(endDate) };
    }

    // if startDate and endDate both are defined, we can check for more validation (startDate < endDate)
    if (
      filter?.date?.$gte &&
      filter?.date?.$lte &&
      filter.date.$gte > filter.date.$lte
    ) {
      throw new BadRequestException('End date should be greater than start date');
    }

    return this.invoiceModel.find(filter);
  }

  async getInvoiceById(id: string) {
    const invoice = await this.invoiceModel.findById(id);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return invoice;
  }
}
