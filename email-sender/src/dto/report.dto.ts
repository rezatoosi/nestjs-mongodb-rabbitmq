export interface ReportDto {
  generatedAt: Date;
  date: Date;
  totalSales: number;
  itemsSold: [ItemSoldDto];
}

export interface ItemSoldDto {
  totalQuantitySold: number;
  sku: string;
}
