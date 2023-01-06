import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>('UserRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = new CreateUserDto();
      createUserDto.email = 'test@example.com';
      createUserDto.firstName = 'Test';
      createUserDto.lastName = 'User';

      const saveSpy = jest.spyOn(repository, 'save').mockResolvedValueOnce({
        id: 1,
        ...createUserDto,
      });

      const user = await service.create(createUserDto);

      expect(saveSpy).toHaveBeenCalledWith({ ...createUserDto });
      expect(user).toEqual({ id: 1, ...createUserDto });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: any[] = [
        {
          id: 1,
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
        },
        {
          id: 2,
          email: 'test2@example.com',
          firstName: 'Test',
          lastName: 'User2',
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(users);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const user: any = {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(user);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const deleteResult: any = {
        affected: 1,
      };

      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);

      const result = await service.remove(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(deleteResult);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = new UpdateUserDto();
      updateUserDto.email = 'test@example.com';
      updateUserDto.firstName = 'Test';
      updateUserDto.lastName = 'User';

      const updateResult: any = {
        affected: 1,
      };

      jest.spyOn(repository, 'update').mockResolvedValue(updateResult);

      const result = await service.update(1, updateUserDto);

      expect(repository.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual(updateResult);
    });
  });
});
