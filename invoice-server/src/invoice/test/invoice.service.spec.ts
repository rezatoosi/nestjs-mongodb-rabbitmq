import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from '../invoice.service';
import { getModelToken } from '@nestjs/mongoose';
import { Invoice } from '../schema/invoice.schema';
import { Model } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { invoiceStub, newInvoiceStub } from './stubs/invoice.stub';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let model: Model<Invoice>;

  const mockInvoiceService = {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getModelToken(Invoice.name),
          useValue: mockInvoiceService,
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    model = module.get<Model<Invoice>>(getModelToken(Invoice.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('(100) createInvoice', () => {
    it('(101) should throw an error if reference code existed', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(newInvoiceStub());

      await expect(service.createInvoice(newInvoiceStub())).rejects.toThrow(
        new BadRequestException('Invoice with this reference already exists'),
      );

      expect(model.findOne).toHaveBeenCalledWith({
        reference: newInvoiceStub().reference,
      });
    });

    it('(102) should create and return an invoice', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);
      model.create = jest.fn().mockResolvedValueOnce(invoiceStub());

      const result = await service.createInvoice(newInvoiceStub());

      expect(result).toEqual(invoiceStub());
      expect(model.findOne).toHaveBeenCalledWith({
        reference: newInvoiceStub().reference,
      });
      expect(model.create).toHaveBeenCalledWith(newInvoiceStub());
    });
  });

  describe('(200) getInvoiceList', () => {
    it('(201) should return an invoice list', async () => {
      jest.spyOn(model, 'find').mockResolvedValueOnce([invoiceStub()]);

      const result = await service.getInvoiceList({
        startDate: '2025-04-27',
        endDate: '2025-04-28',
      });
      expect(result).toHaveLength(1);
      expect(model.find).toHaveBeenCalled();
    });

    it('(202) should throw error when startDate is not a valid date', async () => {
      await expect(async () => {
        await service.getInvoiceList({ startDate: '2025-14-27' });
      }).rejects.toThrow(
        new BadRequestException(
          "Invalid start date. Date should be in this format 'YYYY-MM-DD'",
        ),
      );
    });

    it('(203) should throw error when endDate is not a valid date', async () => {
      await expect(async () => {
        await service.getInvoiceList({ endDate: '2025-14-27' });
      }).rejects.toThrow(
        new BadRequestException(
          "Invalid end date. Date should be in this format 'YYYY-MM-DD'",
        ),
      );
    });

    it('(204) should throw error when startDate > endDate', async () => {
      await expect(async () => {
        await service.getInvoiceList({
          startDate: '2025-04-27',
          endDate: '2025-04-26',
        });
      }).rejects.toThrow(
        new BadRequestException('End date should be greater than start date'),
      );
    });
  });

  describe('(300) getInvoiceById', () => {
    it('(301) should return an invoice', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(invoiceStub());

      const result = await service.getInvoiceById(invoiceStub()._id);

      expect(result).toEqual(invoiceStub());
      expect(model.findById).toHaveBeenCalledWith(invoiceStub()._id);
    });

    it('(302) should return an Exception when invoice not exists', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(null);

      const result = async () => {
        await service.getInvoiceById('someUnavailableId');
      };

      expect(result).rejects.toThrow(
        new NotFoundException('Invoice not found'),
      );
      expect(model.findById).toHaveBeenCalledWith('someUnavailableId');
    });
  });
});
