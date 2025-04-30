import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../app.controller';
import { AppService } from '../../app.service';
import { reportStub } from '../stubs/report.stub';
import { ReportDto } from 'src/dto/report.dto';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  const mockAppService = {
    sendReportEmail: jest.fn().mockReturnValue('Email Sent'),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('sendReportEmail', () => {
    let sentMail: unknown;
    const reportData: ReportDto = reportStub();

    beforeEach(async () => {
      sentMail = await appController.sendReportEmail(reportData);
    });

    it('should return send email response', () => {
      expect(sentMail).toEqual('Email Sent');
    });

    it('should have been called appService.sendReportEmail', async () => {
      expect(appService.sendReportEmail).toHaveBeenCalledWith(reportData);
    });
  });
});
