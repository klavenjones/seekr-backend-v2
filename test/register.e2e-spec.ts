import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/api/user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../src/api/user/dto/create-user.dto';
import * as dotenv from 'dotenv';
import { UserModule } from '../src/api/user/user.module';
import { AuthModule } from '../src/auth/auth.module';

dotenv.config();

describe('RegisterController (integration)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        AuthModule,
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

    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password',
    };

    const { body } = await request(app.getHttpServer())
      .post('/auth/register')
      .send(createUserDto)
      .expect(201);

    const user = await userRepository.findOneBy({
      email: 'john.doe@example.com',
    });

    expect(user).toBeDefined();
    expect(body.message).toBe(
      'Hey John, your account was created successfully',
    );
  });

  it('should return 400 if the request is invalid', async () => {
    const createUserDto: CreateUserDto = {
      firstName: '',
      lastName: '',
      email: 'invalid',
      password: '',
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(createUserDto)
      .expect(400);
  });
});
