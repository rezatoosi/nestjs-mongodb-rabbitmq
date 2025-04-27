import { Injectable } from '@nestjs/common';
import { ReportDto } from './dto/report.dto';

@Injectable()
export class AppService {
  sendReportEmail(data: ReportDto) {
    console.log(data);
  }
}
