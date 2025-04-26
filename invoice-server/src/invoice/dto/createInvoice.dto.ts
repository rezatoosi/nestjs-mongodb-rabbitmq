import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateInvoiceDto {
    @IsString()
    @IsNotEmpty()
    customer: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    reference: string;

    items?: [InvoiceItemDto];
    
}

export class InvoiceItemDto {
    @IsString()
    @IsNotEmpty()
    sku: string;

    @IsNumber()
    @IsNotEmpty()
    qt: number;
}