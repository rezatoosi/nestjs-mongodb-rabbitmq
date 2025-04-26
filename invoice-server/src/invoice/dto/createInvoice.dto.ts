export class CreateInvoiceDto {
    
    customer: string;
    amount: number;
    reference: string;
    items: [
        {
            sku: string;
            qt: number;
        }
    ];
    
}