import { Test, TestingModule } from '@nestjs/testing';
import { RegisterService } from './register.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { UserService } from '../../user/user.service';
import { User } from '../../user/entities/user.entity';
import { HttpException } from '@nestjs/common';

describe('RegisterService', () => {
  let service: RegisterService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            getUserByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    service = module.get<RegisterService>(RegisterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should hash the password before saving the user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'password',
      } as CreateUserDto;

      const spy = jest.spyOn(userService, 'create');

      await service.register(createUserDto);

      expect(spy).toHaveBeenCalledWith({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: expect.stringMatching(/^\$2[ayb]\$.{56}$/),
      });
    });
  });

  it('should return the newly created user', async () => {
    const createUserDto = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password',
    } as CreateUserDto;
    const user = {
      id: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'hashed password',
    } as User;

    jest.spyOn(userService, 'create').mockResolvedValue(user);

    const result = await service.register(createUserDto);

    expect(result).toEqual(user);
  });

  it('should throw an error if the create method of the UserService fails', async () => {
    const createUserDto = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password',
    } as CreateUserDto;

    jest
      .spyOn(userService, 'create')
      .mockRejectedValue(new Error('Failed to create user'));

    try {
      await service.register(createUserDto);
      fail('Expected an error to be thrown');
    } catch (error) {
      expect(error.message).toEqual('Failed to create user');
    }
  });

  it('should throw a HttpException if the email is already in use', async () => {
    const createUserDto = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password',
    };

    const existingUser: User = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'testing123',
    };

    jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(existingUser);

    try {
      await service.register(createUserDto);
      fail('Expected an HttpException');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.getStatus()).toEqual(409);
      expect(error.getResponse()).toEqual(
        'A user with this email address already exists',
      );
    }
  });
});
