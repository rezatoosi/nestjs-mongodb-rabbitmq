import { Injectable } from '@nestjs/common';
import { ReportDto } from './dto/report.dto';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AppService {
  constructor(private readonly mailService: MailerService) {}

  private _convertDate(date: Date, format: 'D' | 'DT') {
    return format == 'D'
      ? new Date(date).toLocaleDateString('en-US', { timeZone: 'UTC' })
      : new Date(date).toLocaleString('en-US', { timeZone: 'UTC' });
  }

  async sendReportEmail(data: ReportDto) {
    const mailText = `
    Dear Manager,
    This is the daily report summary for ${this._convertDate(data.date, 'D')},
    Total sales amount: ${data.totalSales},
    Total items sold by SKU:
    ${data.itemsSold.map((item) => ` - Item SKU: "${item.sku}" \t - Total Quantity Sold: ${item.totalQuantitySold}`).join(`\n    `)}
    ---
    this report generated at: ${this._convertDate(data.generatedAt, 'DT')} (UTC)
    `;

    const mailOptions: ISendMailOptions = {
      from: 'report@reportserver.local', //TODO: get from .env
      to: 'manager@company.local', //TODO: get from .env
      subject: `Daily Sales Summary Report (${data.date})`,
      text: mailText,
    };
    const sentMail = await this.mailService.sendMail(mailOptions);
    return sentMail;
  }
}
