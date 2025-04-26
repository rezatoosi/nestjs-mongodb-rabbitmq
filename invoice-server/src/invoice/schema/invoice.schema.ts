import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class InvoiceItem {
    @Prop()
    sku: string;

    @Prop()
    qt: number;
}

export const InvoiceItemSchema = SchemaFactory.createForClass(InvoiceItem);

@Schema()
export class Invoice {
    @Prop({ required: true })
    customer: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ unique: true, required: true })
    reference: string;

    @Prop({ required: true, default: Date.now() })
    date: Date;

    @Prop({ type: [InvoiceItem], default: [] })
    items?: Array<InvoiceItem>;
}

export const InvoiceSchema =  SchemaFactory.createForClass(Invoice);