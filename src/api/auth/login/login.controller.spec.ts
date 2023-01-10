import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller';
import { LocalAuthGuard } from '../guards/local.auth.guard';

describe('LoginController', () => {
  let loginController: LoginController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        {
          provide: LocalAuthGuard,
          useValue: {
            canActivate: jest.fn(() => true),
          },
        },
      ],
    }).compile();
    loginController = module.get<LoginController>(LoginController);
  });

  describe('login', () => {
    it('should return the user object', async () => {
      const req = {
        user: {
          id: 1,
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      const user = await loginController.login(req, res);

      expect(user).toEqual(req.user);
    });
  });

  it('should log out the user and clear the session cookie', async () => {
    const req = {
      user: {
        id: 1,
        username: 'testuser',
        email: 'testuser@example.com',
      },
      logOut: jest.fn().mockResolvedValue('ERROR'),
      session: {
        destroy: jest.fn(),
      },
    };
    const res = {
      clearCookie: jest.fn(),
    };

    loginController.logout(req, res);

    expect(req.logOut).toHaveBeenCalledWith(
      { keepSessionInfo: false },
      expect.any(Function),
    );
  });
});
