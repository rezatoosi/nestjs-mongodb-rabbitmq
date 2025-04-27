import { IsDateString, IsOptional } from "class-validator";

export class InvoiceListQuery {
    @IsDateString()
    @IsOptional()
    startDate?: string;

    @IsDateString()
    @IsOptional()
    endDate: string;
}