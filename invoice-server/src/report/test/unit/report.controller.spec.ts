import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from 'src/report/report.controller';
import { ReportService } from 'src/report/report.service';
import { reportStub } from '../stubs/report.stubs';
import { ReportDto } from 'src/report/dto/report.dto';

describe('ReportController', () => {
  let controller: ReportController;
  let service: ReportService;

  const mockReportService = {
    generateDailyReport: jest.fn(),
    sendReport: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        {
          provide: ReportService,
          useValue: mockReportService,
        },
      ],
    }).compile();

    controller = app.get<ReportController>(ReportController);
    service = app.get<ReportService>(ReportService);
  });

  describe('getReport', () => {
    let reportData = reportStub();
    const reportDate = reportData.date.toISOString();
    let recievedReport: unknown;

    beforeEach(async () => {
      jest.spyOn(service, 'generateDailyReport').mockResolvedValue(reportData);
      recievedReport = await controller.getReport(reportDate);
    });

    it('should call reportService.generateDailyReport', () => {
      expect(service.generateDailyReport).toHaveBeenCalledWith(
        new Date(reportDate),
      );
    });

    it('should return the report data', () => {
      expect(recievedReport).toEqual(reportData);
    });
  });

  describe('sendReport', () => {
    beforeEach(async () => {
      await controller.sendReport();
    });

    it('should call reportService.sendReport', () => {
      expect(service.sendReport).toHaveBeenCalled();
    });
  });
});
