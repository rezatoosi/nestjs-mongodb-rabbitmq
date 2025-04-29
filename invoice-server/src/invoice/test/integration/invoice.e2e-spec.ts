import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/database/database.service';
import {
  invoiceStub,
  newInvoiceListStub,
  newInvoiceStub,
} from '../stubs/invoice.stub';

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
    await dbConnection.close();
    await app.close();
  });

  beforeEach(async () => {
    await dbConnection.collection('invoices').deleteMany({});
  });

  describe('/invoices (POST)', () => {
    it('should create an invoice and retuen it', async () => {
      const response = await request(httpServer)
        .post('/invoices')
        .send(newInvoiceStub());
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(newInvoiceStub());
    });

    it('should throw an error - duplicated reference code', async () => {
      await dbConnection.collection('invoices').insertOne(newInvoiceStub());
      const response = await request(httpServer)
        .post('/invoices')
        .send(newInvoiceStub());
      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ error: 'Bad Request' });
    });
  });

  describe('/invoices (GET)', () => {
    it('should return an array of invoices', async () => {
      await dbConnection.collection('invoices').insertOne(newInvoiceStub());

      const response = await request(httpServer).get('/invoices');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body).toMatchObject([newInvoiceStub()]);
    });

    it('should return an array of invoices in specific date range', async () => {
      await dbConnection
        .collection('invoices')
        .insertMany(newInvoiceListStub()); //inserts 10 documents in db

      const response = await request(httpServer)
        .get('/invoices')
        .query({ startDate: '2025-04-12', endDate: '2025-04-15' }); // returns only 4 documents

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(4);
    });
  });

  describe('/invoices/:id (GET)', () => {
    it('should return an invoices with specefic id', async () => {
      const createdInvoice = await dbConnection
        .collection('invoices')
        .insertOne(newInvoiceStub());

      const response = await request(httpServer).get(
        `/invoices/${createdInvoice.insertedId}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(newInvoiceStub());
    });

    it('should return empty because invoice not found', async () => {
      return request(httpServer)
        .get(`/invoices/${invoiceStub()._id}`)
        .expect(404)
        .then((response) =>
          expect(response.body).toMatchObject({ error: 'Not Found' }),
        );
    });

    it('should throw an error because of invalid id', async () => {
      return request(httpServer)
        .get(`/invoices/invalid-id`)
        .expect(400)
        .then((response) =>
          expect(response.body).toMatchObject({ error: 'Bad Request' }),
        );
    });
  });
});
