import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Invoice } from 'src/invoice/schema/invoice.schema';
import { ReportService } from 'src/report/report.service';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import { ReportDto } from 'src/report/dto/report.dto';
import { reportStub } from '../stubs/report.stubs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

describe('ReportService', () => {
  let service: ReportService;
  let model: Model<Invoice>;
  let client: ClientProxy;

  const mockInvoiceModel = {
    aggregate: jest.fn().mockResolvedValue([
      {
        totalSales: [{ totalSales: 100 }],
        itemsSold: [{ sku: 'SKU333', totalQuantitySold: 2 }],
      },
    ]),
  };

  const mockRabbitClient = {
    emit: jest.fn().mockReturnValue(of(null)),
  };

  const mockLogger = {
    log: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: getModelToken(Invoice.name),
          useValue: mockInvoiceModel,
        },
        {
          provide: 'INVOICE_SERVICE',
          useValue: mockRabbitClient,
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: mockLogger,
        }
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    model = module.get<Model<Invoice>>(getModelToken(Invoice.name));
    client = module.get<ClientProxy>('INVOICE_SERVICE');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate daily report', async () => {
    const mockReport = {
      date: new Date(),
      totalSales: 100,
      itemsSold: [{ sku: 'SKU333', totalQuantitySold: 2 }],
    };

    const report = await service.generateDailyReport(mockReport.date);

    expect(report).toMatchObject(mockReport);
    expect(model.aggregate).toHaveBeenCalled();
  });

  it('should send report', async () => {
    const mockReport: ReportDto = reportStub();
    jest
      .spyOn(service, 'generateDailyReport')
      .mockResolvedValueOnce(mockReport);

    await service.sendReport(mockReport.date);
    expect(client.emit).toHaveBeenCalledWith('report_generated', mockReport);
  });
});
