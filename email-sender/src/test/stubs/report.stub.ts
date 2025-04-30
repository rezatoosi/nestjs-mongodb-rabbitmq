import { ReportDto } from 'src/dto/report.dto';

export const reportStub = (): ReportDto => {
  return {
    generatedAt: new Date(),
    date: new Date(),
    totalSales: 100,
    itemsSold: [
      {
        totalQuantitySold: 2,
        sku: 'SKU333',
      },
    ],
  };
};
