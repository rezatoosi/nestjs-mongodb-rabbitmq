import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/database/database.service';
import { newInvoiceStub } from '../stubs/invoice.stub';

describe('InvoiceController', () => {
  let dbConnection: Connection;
  let app: INestApplication;
  let httpServer: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getHandle();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    // await dbConnection.close();
    await app.close();
  });

  describe('/invoice (GET)', () => {
    it('should return an array of invoices', async () => {
        await dbConnection.collection('invoices').insertOne(newInvoiceStub());
        const response = await request(httpServer).get('/invoices');
        expect(response.statusCode).toBe(200);

    });
  });
});
