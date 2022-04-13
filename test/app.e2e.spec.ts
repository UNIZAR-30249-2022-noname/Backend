import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestHttpModule } from '../src/Infraestructure/testhttp.module';


it('Testing to see if Jest works', () => {
  expect(1).toBe(1)
})

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestHttpModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/test/prueba')
      .expect(200)
      .expect('Hello World');
  });
});
