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

        await dbConnection
                .collection('invoices')
                .insertMany(newInvoiceListForSameDateStub());
    });

    describe('/report (GET)', () => {
        it('should generate a report', async () => {
            return request(httpServer)
                .get('/report')
                .query({ date: '2025-04-27' })
                .expect(200)
                .then(response => {
                    expect(response.body.totalSales).toEqual(500);
                    expect(response.body.itemsSold).toHaveLength(1);
                });
        });
    });

    describe('/report/send (GET)', () => {
        it('should generate a report and send it to rabbitMQ', async () => {
            return request(httpServer)
                .get('/report/send')
                .query({ date: '2025-04-27' })
                .expect(200);
        });
    });
});
