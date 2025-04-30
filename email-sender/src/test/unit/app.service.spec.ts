import { MailerService } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from 'src/app.service';
import { ReportDto } from 'src/dto/report.dto';
import { reportStub } from '../stubs/report.stub';

describe('AppService', () => {
  let service: AppService;

  const mockMailerService = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendReportEmail', () => {
    let sentMail: unknown;
    const reportData: ReportDto = reportStub();

    beforeEach(() => {
      sentMail = service.sendReportEmail(reportData);
    });

    it('should call mailerService.sendMail', () => {
      expect(mockMailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: expect.stringContaining('@'),
          to: expect.stringContaining('@'),
          subject: expect.stringContaining('Daily Sales Summary Report'),
        }),
      );
    });
  });
});
