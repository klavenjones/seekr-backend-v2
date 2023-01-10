import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from './login.service';
import { UserService } from '../../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('LoginService', () => {
  let service: LoginService;
  let userService: UserService;

  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  const testUser: User = {
    id: 1,
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'testing123',
  };

  const testLoginUser: any = {
    email: 'test@example.com',
    password: 'testing123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        UserService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn((entity) => entity),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    service = module.get<LoginService>(LoginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user if the email and password match', async () => {
      const { password, ...rest } = testUser; // eslint-disable-line
      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue({
        ...testUser,
        password: bcrypt.hashSync(testUser.password, 8),
      });

      const mockUserWithoutPassword = { ...rest };

      const result = await service.validateUser(
        testLoginUser.email,
        testLoginUser.password,
      );
      expect(result).toEqual(mockUserWithoutPassword);
    });

    it('should return null if the email and password do not match', async () => {
      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(
        new Promise<User>((resolve) => {
          resolve({
            ...testUser,
            password: bcrypt.hashSync(testUser.password, 8),
          });
        }),
      );

      const result = await service.validateUser(
        'test@example.com',
        'invalid password',
      );

      expect(result).toBeNull();
    });

    it('should return null if the user does not exist', async () => {
      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(null);

      const result = await service.validateUser(
        testLoginUser.email,
        'password',
      );

      expect(result).toBeNull();
    });
  });
});
