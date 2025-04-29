import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/database/database.service';
import { newInvoiceListForSameDateStub } from 'src/invoice/test/stubs/invoice.stub';
import * as request from 'supertest';

describe('ReportController', () => {
    let dbConnection: Connection;
    let app: INestApplication;
    let httpServer: any;

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
        dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getHandle();
        httpServer = app.getHttpServer();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(async () => {
        await dbConnection.collection('invoices').deleteMany({});
    });

    describe('/report (GET)', () => {
        it('should generate a report', async () => {
            await dbConnection
                .collection('invoices')
                .insertMany(newInvoiceListForSameDateStub());

            return request(httpServer)
                .get('/report')
                .query({date: '2025-04-27'})
                .expect(200)
                .then(response => {
                    console.log(response.body);
                    expect(response.body.generatedAt).toBeDefined();
                    expect(response.body.date).toBeDefined();
                    expect(response.body.totalSales).toEqual(500);
                    expect(response.body.itemsSold).toHaveLength(1);
                });
        });

    });

    //   describe('/invoices (GET)', () => {
    //     it('should return an array of invoices', async () => {
    //       await dbConnection.collection('invoices').insertOne(newInvoiceStub());

    //       const response = await request(httpServer).get('/invoices');

    //       expect(response.status).toBe(200);
    //       expect(response.body).toHaveLength(1);
    //       expect(response.body).toMatchObject([newInvoiceStub()]);
    //     });

    //     it('should return an array of invoices in specific date range', async () => {
    //       await dbConnection
    //         .collection('invoices')
    //         .insertMany(newInvoiceListStub()); //inserts 10 documents in db

    //       const response = await request(httpServer)
    //         .get('/invoices')
    //         .query({ startDate: '2025-04-12', endDate: '2025-04-15' }); // returns only 4 documents

    //       expect(response.status).toBe(200);
    //       expect(response.body).toHaveLength(4);
    //     });
    //   });

    //   describe('/invoices/:id (GET)', () => {
    //     it('should return an invoices with specefic id', async () => {
    //       const createdInvoice = await dbConnection
    //         .collection('invoices')
    //         .insertOne(newInvoiceStub());

    //       const response = await request(httpServer).get(
    //         `/invoices/${createdInvoice.insertedId}`,
    //       );

    //       expect(response.status).toBe(200);
    //       expect(response.body).toMatchObject(newInvoiceStub());
    //     });

    //     it('should return empty because invoice not found', async () => {
    //       return request(httpServer)
    //         .get(`/invoices/${invoiceStub()._id}`)
    //         .expect(404)
    //         .then((response) =>
    //           expect(response.body).toMatchObject({ error: 'Not Found' }),
    //         );
    //     });

    //     it('should throw an error because of invalid id', async () => {
    //       return request(httpServer)
    //         .get(`/invoices/invalid-id`)
    //         .expect(400)
    //         .then((response) =>
    //           expect(response.body).toMatchObject({ error: 'Bad Request' }),
    //         );
    //     });
    //   });
});
