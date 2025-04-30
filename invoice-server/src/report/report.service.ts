import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy, RmqStatus } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Invoice } from 'src/invoice/schema/invoice.schema';
import { ReportDto } from './dto/report.dto';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
    @Inject('INVOICE_SERVICE') private readonly rabbitClient: ClientProxy,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) { }

  @Cron('0 12 * * *')
  async sendReport(date: Date) {
    const report = await this.generateDailyReport(date);

    await firstValueFrom(
      this.rabbitClient.emit('report_generated', report).pipe(
        catchError((exception: Error) => {
          this.logger.log('error', 'RabbitMQ server not available');
          return throwError(
            () => new HttpErrorByCode[500]('Something went wrong'),
          );
        }),
      )
    );
    return;
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

    const totalSales = reportData[0].totalSales[0] ? reportData[0].totalSales[0].totalSales : 0;
    const itemsSold = reportData[0]?.itemsSold;

    const report: ReportDto = {
      generatedAt: new Date(),
      date: reportDate,
      totalSales,
      itemsSold,
    };

    return report;
  }
}
