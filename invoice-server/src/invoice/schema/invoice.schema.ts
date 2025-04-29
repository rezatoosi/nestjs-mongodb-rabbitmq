import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema({ _id: false })
export class InvoiceItem {
  @Prop()
  sku: string;

  @Prop()
  qt: number;
}

export const InvoiceItemSchema = SchemaFactory.createForClass(InvoiceItem);

@Schema() // TODO: check {timestamps: true}
export class Invoice {
  @Prop({ required: true })
  customer: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ unique: true, required: true })
  reference: string;

  @Prop({ default: () => Date.now() })
  date?: Date;

  @Prop({ type: [InvoiceItemSchema], default: [] })
  items?: InvoiceItem[];
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
