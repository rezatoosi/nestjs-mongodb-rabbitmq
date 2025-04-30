import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ReportDto } from './dto/report.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('report_generated')
  sendReportEmail(@Payload() data: ReportDto) {
    return this.appService.sendReportEmail(data);
  }
}
