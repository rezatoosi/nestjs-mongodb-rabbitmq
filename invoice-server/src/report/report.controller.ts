import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  async getReport(@Query('date') date?: string) {
    const reportDate = date ? new Date(date) : new Date();
    const reportData = await this.reportService.generateDailyReport(reportDate);
    return reportData;
  }

  @Get('/send')
  async sendReport(@Query('date') date?: string) {
    const reportDate = date ? new Date(date) : new Date();
    await this.reportService.sendReport(reportDate);
    return { message: 'Report sent successfully' };
  }
}
