import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import {
  type CreateTokenResetPasswordDto,
  type MessageDto,
  type ResetPasswordDto,
  type SigninAuthDto,
  type SignupAuthDto,
  type TokenDto,
  type UserDto,
  UserRole,
} from '@rent-to-craft/dtos';

import { ValidTokenService } from '../valid-token/valid-token.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUser: UserDto = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword', // eslint-disable-line sonarjs/no-hardcoded-credentials
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.user,
    isPublic: true,
    description: null,
    address: null,
    phone: null,
    contactEmail: null,
    posts: null,
    postComments: null,
    banner: null,
    profilePicture: null,
    city: null,
    rentals: null,
    rentalComments: null,
    cart: null,
    orders: null,
  };

  const mockTokenDto: TokenDto = {
    accessToken: 'mock-jwt-token',
  };

  const mockMessageDto: MessageDto = {
    message: 'Success message',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            signin: jest.fn(),
            forgotPassword: jest.fn(),
            resetPassword: jest.fn(),
            logout: jest.fn(),
          },
        },
        {
          provide: ValidTokenService,
          useValue: {
            findByToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should create a new user', async () => {
      const signupDto: SignupAuthDto = {
        email: 'test@example.com',
        password: 'password123', // eslint-disable-line sonarjs/no-hardcoded-credentials
        firstName: 'John',
        lastName: 'Doe',
      };

      const expectedResult = mockUser;

      jest.spyOn(authService, 'signup').mockResolvedValue(expectedResult);

      const result = await controller.signup(signupDto);

      expect(result).toEqual(expectedResult);
      expect(authService.signup).toHaveBeenCalledWith(signupDto);
    });
  });

  describe('signin', () => {
    it('should authenticate user and return token', async () => {
      const signinDto: SigninAuthDto = {
        email: 'test@example.com',
        password: 'password123', // eslint-disable-line sonarjs/no-hardcoded-credentials
      };

      const expectedResult = mockTokenDto;

      jest.spyOn(authService, 'signin').mockResolvedValue(expectedResult);

      const result = await controller.signin(signinDto);

      expect(result).toEqual(expectedResult);
      expect(authService.signin).toHaveBeenCalledWith(signinDto);
    });
  });

  describe('forgotPassword', () => {
    it('should send password reset email', async () => {
      const email = 'test@example.com';
      const createTokenResetPasswordDto: CreateTokenResetPasswordDto = {
        email,
      };

      const expectedResult = mockMessageDto;

      jest
        .spyOn(authService, 'forgotPassword')
        .mockResolvedValue(expectedResult);

      const result = await controller.forgotPassword(
        createTokenResetPasswordDto,
      );

      expect(result).toEqual(expectedResult);
      expect(authService.forgotPassword).toHaveBeenCalledWith(
        createTokenResetPasswordDto,
      );
    });
  });

  describe('resetPassword', () => {
    it('should reset user password', async () => {
      const token = 'reset-token';
      const resetPasswordDto: ResetPasswordDto = {
        password: 'newpassword123', // eslint-disable-line sonarjs/no-hardcoded-credentials
      };

      const expectedResult = mockMessageDto;

      jest
        .spyOn(authService, 'resetPassword')
        .mockResolvedValue(expectedResult);

      const result = await controller.resetPassword(token, resetPasswordDto);

      expect(result).toEqual(expectedResult);
      expect(authService.resetPassword).toHaveBeenCalledWith(
        token,
        resetPasswordDto,
      );
    });
  });

  describe('logout', () => {
    it('should logout user', async () => {
      const token = 'Bearer mock-jwt-token';

      const expectedResult = mockMessageDto;

      jest.spyOn(authService, 'logout').mockResolvedValue(expectedResult);

      const result = await controller.logout(token, mockUser);

      expect(result).toEqual(expectedResult);
      expect(authService.logout).toHaveBeenCalledWith(token, mockUser.id);
    });
  });
});
