import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from '../invoice.controller';
import { InvoiceService } from '../invoice.service';
import { invoiceStub, newInvoiceStub } from './stubs/invoice.stub';
import { Invoice } from '../schema/invoice.schema';
import { InvoiceListQueryDto } from '../dto/invoiceListQuery.dto';

describe('InvoiceController', () => {
  let controller: InvoiceController;
  let service: InvoiceService;

  const mockInvoiceService = {
    createInvoice: jest.fn().mockResolvedValue(invoiceStub()),
    getInvoiceList: jest.fn().mockResolvedValue([invoiceStub()]),
    getInvoiceById: jest.fn().mockResolvedValue(invoiceStub()),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        {
          provide: InvoiceService,
          useValue: mockInvoiceService,
        },
      ],
    }).compile();

    controller = module.get<InvoiceController>(InvoiceController);
    service = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createInvocie', () => {
    let invoice: Invoice;

    beforeEach(async () => {
      invoice = await controller.createInvoice(newInvoiceStub());
    });

    it('should create and return an invoice', () => {
      expect(invoice).toEqual(invoiceStub());
    });

    it('should call service.createInvoice', () => {
      expect(service.createInvoice).toHaveBeenCalledWith(newInvoiceStub());
    });
  });

  describe('getInvoiceListByDate', () => {
    let invoices: Invoice[];
    const invoiceListQueryDto: InvoiceListQueryDto = {
      startDate: '2025-04-27',
      endDate: '2025-04-28',
    };

    beforeEach(async () => {
      invoices = await controller.getInvoiceListByDate(invoiceListQueryDto);
    });

    it('should return a list of invoices', () => {
      expect(invoices).toEqual([invoiceStub()]);
    });

    it('should call service.getInvoiceList', () => {
      expect(service.getInvoiceList).toHaveBeenCalledWith(invoiceListQueryDto);
    });
  });

  describe('getInvoiceById', () => {
    let invoice: Invoice;

    beforeEach(async () => {
      invoice = await controller.getInvoiceById(invoiceStub()._id);
    });

    it('should return an invoice', () => {
      expect(invoice).toEqual(invoiceStub());
    });

    it('should call service.getInvoiceById', () => {
      expect(service.getInvoiceById).toHaveBeenCalledWith(invoiceStub()._id);
    });
  });
});
