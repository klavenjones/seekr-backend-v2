import { Test, TestingModule } from '@nestjs/testing';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { HttpStatus } from '@nestjs/common';
import { CreateUserDto } from '../../api/user/dto/create-user.dto';
import { User } from '../../api/user/entities/user.entity';

describe('RegisterController', () => {
  let controller: RegisterController;
  let registerService: RegisterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterController],
      providers: [
        {
          provide: RegisterService,
          useValue: {
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RegisterController>(RegisterController);
    registerService = module.get<RegisterService>(RegisterService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should return a 201 status code and a success message on successful registration', async () => {
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
      jest.spyOn(registerService, 'register').mockResolvedValue(user);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await controller.register(res as any, createUserDto);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        message: `Hey ${createUserDto.firstName}, your account was created successfully`,
        status: 201,
      });
    });

    it('should return an error message and status code if registration fails', async () => {
      const createUserDto = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'password',
      } as CreateUserDto;
      const error = {
        message: 'Registration failed',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
      jest.spyOn(registerService, 'register').mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await controller.register(res as any, createUserDto);

      expect(res.status).toHaveBeenCalledWith(error.status);
      expect(res.json).toHaveBeenCalledWith({
        message: error.message,
        status: error.status,
      });
    });
  });

  it('should call the register method of the RegisterService with the correct arguments', async () => {
    const createUserDto = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password',
    } as CreateUserDto;
    jest.spyOn(registerService, 'register').mockResolvedValue({} as User);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    await controller.register(res as any, createUserDto);

    expect(registerService.register).toHaveBeenCalledWith(createUserDto);
  });

  it('should return an error message and status code if the register method of the RegisterService throws an error', async () => {
    const createUserDto = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password',
    } as CreateUserDto;
    const error = {
      message: 'Registration failed',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    };
    jest.spyOn(registerService, 'register').mockRejectedValue(error);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    await controller.register(res as any, createUserDto);

    expect(res.status).toHaveBeenCalledWith(error.status);
    expect(res.json).toHaveBeenCalledWith({
      message: error.message,
      status: error.status,
    });
  });
});
