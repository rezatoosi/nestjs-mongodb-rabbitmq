import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Invoice } from "src/invoice/schema/invoice.schema";

@Injectable()
export class ReportService {
    constructor(@InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>) { }

    async generateReport(date?: Date) {
        const reportDate = date || new Date();
        const startDate = new Date(reportDate.setUTCHours(0, 0, 0, 0));
        const endDate = new Date(reportDate.setUTCHours(23, 59, 59, 999));

        const reportData = await this.invoiceModel.aggregate([
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
                $unwind: "$itemsSold",
            },
            {
                $unwind: "$itemsSold",
            },
            
        ]);

        return reportData;
    }
}