import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Model } from "mongoose";
import { Invoice } from "src/invoice/schema/invoice.schema";

@Injectable()
export class ReportService {
    constructor(@InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>) { }

    @Cron(CronExpression.EVERY_5_SECONDS)
    async sendReport() {
        console.log('report sent');
    }

    async generateDailyReport(date: Date) {
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
                    totalSales: { $sum: "$amount" },
                    itemsSold: { $push: "$items" },
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
                            $unwind: "$itemsSold",
                        },
                        {
                            $unwind: "$itemsSold",
                        },
                        {
                            $group: {
                                _id: "$itemsSold.sku",
                                totalQuantitySold: { $sum: "$itemsSold.qt" },
                            },
                        },
                        {
                            $project: {
                                sku: "$_id",
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

        const report = {
            date: reportDate,
            totalSales,
            itemsSold,
        };


        return report;
    }
}