import { Invoice } from "src/invoice/schema/invoice.schema";

export const invoiceStub = () => {
    return {
        customer: "John",
        amount: 50,
        reference: "INV123",
        date: new Date("2025-04-27T21:31:05.327Z"),
        items: [
            { sku: "333", qt: 1 }
        ],
        _id: "680ea2199b534b9e471b4ee4",
        __v: 0
    }
}

export const newInvoiceStub = (): Invoice => {
    return {
        customer: invoiceStub().customer,
        amount: invoiceStub().amount,
        reference: invoiceStub().reference,
        date: invoiceStub().date,
        items: invoiceStub().items,
    }
}