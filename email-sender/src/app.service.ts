import { Injectable } from '@nestjs/common';
import { ReportDto } from './dto/report.dto';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
  ) {}

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
      from: this.configService.get<string>('REPORT_EMAIL_FROM'),
      to: this.configService.get<string>('REPORT_EMAIL_TO'),
      subject: `Daily Sales Summary Report (${data.date})`,
      text: mailText,
    };

    if (!mailOptions.from || !mailOptions.to) {
      throw new Error(
        "Please set 'REPORT_EMAIL_FROM' and 'REPORT_EMAIL_TO' variables in .env file",
      );
    }

    const sentMail = await this.mailService.sendMail(mailOptions);

    if (!String(sentMail.response).includes('250 Ok')) {
      throw new Error('Email not sending, something is wrong');
    }

    return sentMail;
  }
}
