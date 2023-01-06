import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { UserModule } from '../src/api/user/user.module';

dotenv.config();

describe('UserController (e2e)', () => {
  let app: INestApplication;
  const result = {
    id: expect.any(Number),
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: expect.any(String),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'postgres',
            host: process.env.TEST_DATABASE_HOST,
            username: process.env.TEST_DATABASE_USER,
            port: 5432,
            database: process.env.TEST_DATABASE_NAME,
            password: process.env.TEST_DATABASE_PASSWORD,
            synchronize: true,
            autoLoadEntities: true,
            dropSchema: true,
          }),
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (POST)', () => {
    const createUserDto = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'tester',
    };

    return request(app.getHttpServer())
      .post('/user')
      .send(createUserDto)
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual({ ...result });
      });
  });

  it('/ (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/user')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(body).toEqual([{ ...result }]);
  });

  it('/:id (GET)', () => {
    return request(app.getHttpServer()).get('/user/1').expect(200);
  });

  it('/:id (Put)', () => {
    const updateUserDto = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    };

    return request(app.getHttpServer())
      .put('/user/1')
      .send(updateUserDto)
      .expect(200);
  });

  it('/:id (DELETE)', () => {
    return request(app.getHttpServer()).delete('/user/1').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
