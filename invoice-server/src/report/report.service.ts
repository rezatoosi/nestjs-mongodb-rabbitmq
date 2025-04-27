import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Invoice } from 'src/invoice/schema/invoice.schema';
import { ReportDto } from './dto/report.dto';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
    @Inject("INVOICE_SERVICE") private readonly rabbitClient: ClientProxy,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  // @Cron("0 12 * * *")
  async sendReport() {
    const report = await this.generateDailyReport();
    await firstValueFrom(
      this.rabbitClient.emit('report_generated', report).pipe(
        catchError((exception: Error) => {
          return throwError(() => new HttpErrorByCode[500]('something went wrong'));
        })
      )
    );
    console.log('report sent');
  }

  async generateDailyReport(date?: Date): Promise<ReportDto> {
    const reportDate = date || new Date();
    const startDate = new Date(reportDate.setUTCHours(0, 0, 0, 0));
    const endDate = new Date(reportDate.setUTCHours(23, 59, 59, 999));

    const stage = [
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$amount' },
          itemsSold: { $push: '$items' },
        },
      },
      {
        $facet: {
          totalSales: [
            {
              $project: {
                _id: 0,
                totalSales: 1,
              },
            },
          ],
          itemsSold: [
            {
              $unwind: '$itemsSold',
            },
            {
              $unwind: '$itemsSold',
            },
            {
              $group: {
                _id: '$itemsSold.sku',
                totalQuantitySold: { $sum: '$itemsSold.qt' },
              },
            },
            {
              $project: {
                sku: '$_id',
                totalQuantitySold: 1,
                _id: 0,
              },
            },
          ],
        },
      },
    ];

    const reportData = await this.invoiceModel.aggregate(stage);

    const totalSales = reportData[0].totalSales[0].totalSales;
    const itemsSold = reportData[0].itemsSold;

    const report: ReportDto = {
      generatedAt: new Date(),
      date: reportDate,
      totalSales,
      itemsSold,
    };

    return report;
  }
}
