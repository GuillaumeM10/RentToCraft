import { HttpException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import { type UserDto, UserRole } from '@rent-to-craft/dtos';
import * as bcrypt from 'bcryptjs';

import { MailService } from '../mail/mail.service';
import { TokenResetPasswordService } from '../token-reset-password/token-reset-password.service';
import { UserService } from '../user/user.service';
import { ValidTokenService } from '../valid-token/valid-token.service';
import { AuthService } from './auth.service';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let tokenResetPasswordService: TokenResetPasswordService;
  let mailService: MailService;
  let validTokenService: ValidTokenService;

  const mockUser: UserDto = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.user,
    // eslint-disable-next-line sonarjs/no-hardcoded-credentials
    password: 'hashedPassword',
    description: null,
    address: null,
    phone: null,
    contactEmail: null,
    isPublic: true,
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

  const mockToken = 'mock-jwt-token';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockValidToken: any = {
    id: 1,
    token: mockToken,
    user: mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            getUserPassword: jest.fn(),
            findOneByEmail: jest.fn(),
            updatePassword: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: TokenResetPasswordService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            clearUserTokens: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendUserConfirmation: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: ValidTokenService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            findAllByUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    tokenResetPasswordService = module.get<TokenResetPasswordService>(
      TokenResetPasswordService,
    );
    mailService = module.get<MailService>(MailService);
    validTokenService = module.get<ValidTokenService>(ValidTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    const signupDto = {
      email: 'test@example.com',
      // eslint-disable-next-line sonarjs/no-hardcoded-credentials
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should create a user and send confirmation email', async () => {
      jest.spyOn(userService, 'create').mockResolvedValue(mockUser);
      jest
        .spyOn(mailService, 'sendUserConfirmation')
        .mockResolvedValue(undefined);

      const result = await service.signup(signupDto);

      expect(userService.create).toHaveBeenCalledWith(signupDto);
      expect(mailService.sendUserConfirmation).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(
        expect.objectContaining({
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          role: mockUser.role,
        }),
      );
    });

    it('should throw HttpException when email is empty', async () => {
      const userWithoutEmail = { ...mockUser, email: '' };
      jest.spyOn(userService, 'create').mockResolvedValue(userWithoutEmail);

      await expect(service.signup(signupDto)).rejects.toThrow(HttpException);
      expect(mailService.sendUserConfirmation).not.toHaveBeenCalled();
    });

    it('should throw HttpException when email is null', async () => {
      const userWithoutEmail = { ...mockUser, email: null };
      jest.spyOn(userService, 'create').mockResolvedValue(userWithoutEmail);

      await expect(service.signup(signupDto)).rejects.toThrow(HttpException);
    });

    it('should throw HttpException when email is undefined', async () => {
      const userWithoutEmail = { ...mockUser, email: undefined };
      jest.spyOn(userService, 'create').mockResolvedValue(userWithoutEmail);

      await expect(service.signup(signupDto)).rejects.toThrow(HttpException);
    });
  });

  describe('signin', () => {
    const signinDto = {
      email: 'test@example.com',
      // eslint-disable-next-line sonarjs/no-hardcoded-credentials
      password: 'password123',
    };

    it('should sign in user successfully', async () => {
      jest
        .spyOn(userService, 'getUserPassword')
        .mockResolvedValue('hashedPassword');
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);
      jest.spyOn(validTokenService, 'create').mockResolvedValue(mockValidToken);
      jest
        .spyOn(tokenResetPasswordService, 'clearUserTokens')
        .mockResolvedValue(undefined);

      const result = await service.signin(signinDto);

      expect(userService.getUserPassword).toHaveBeenCalledWith(signinDto.email);
      expect(bcrypt.compareSync).toHaveBeenCalledWith(
        signinDto.password,
        'hashedPassword',
      );
      expect(userService.findOneByEmail).toHaveBeenCalledWith(signinDto.email);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: mockUser.role,
        id: mockUser.id,
      });
      expect(validTokenService.create).toHaveBeenCalledWith({
        token: mockToken,
        user: mockUser,
      });
      expect(tokenResetPasswordService.clearUserTokens).toHaveBeenCalledWith(
        mockUser.id,
      );
      expect(result).toEqual({ accessToken: mockToken });
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      jest
        .spyOn(userService, 'getUserPassword')
        .mockResolvedValue('hashedPassword');
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

      await expect(service.signin(signinDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when user password is not found', async () => {
      jest.spyOn(userService, 'getUserPassword').mockResolvedValue(null);

      await expect(service.signin(signinDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('generateJwtToken', () => {
    it('should generate JWT token', () => {
      const payload = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.user,
        id: 1,
      };
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result = service.generateJwtToken(payload);

      expect(jwtService.sign).toHaveBeenCalledWith(payload);
      expect(result).toBe(mockToken);
    });
  });

  describe('forgotPassword', () => {
    const createTokenDto = {
      email: 'test@example.com',
    };

    it('should create reset password token and send email', async () => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const mockToken = { id: 1, token: 'reset-token', user: mockUser };
      jest
        .spyOn(tokenResetPasswordService, 'create')
        .mockResolvedValue(mockToken);
      jest.spyOn(mailService, 'create').mockResolvedValue(undefined);

      const result = await service.forgotPassword(createTokenDto);

      expect(tokenResetPasswordService.create).toHaveBeenCalledWith(
        createTokenDto,
      );
      expect(mailService.create).toHaveBeenCalledWith(
        createTokenDto,
        mockToken.token,
      );
      expect(result).toEqual({
        message: 'Un email à été envoyé à test@example.com',
      });
    });
  });

  describe('resetPassword', () => {
    const resetPasswordDto = {
      // eslint-disable-next-line sonarjs/no-hardcoded-credentials
      password: 'newPassword123',
    };
    const token = 'reset-token';

    it('should reset password successfully', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockResetToken: any = {
        id: 1,
        token: 'reset-token',
        user: { email: 'test@example.com' },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockValidTokens: any[] = [
        { id: 1, token: 'valid-token-1', user: mockUser },
        { id: 2, token: 'valid-token-2', user: mockUser },
      ];

      jest
        .spyOn(tokenResetPasswordService, 'findOne')
        .mockResolvedValue(mockResetToken);
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(mockUser);
      jest.spyOn(userService, 'updatePassword').mockResolvedValue(mockUser);
      jest
        .spyOn(tokenResetPasswordService, 'remove')
        .mockResolvedValue(undefined);
      jest
        .spyOn(validTokenService, 'findAllByUser')
        .mockResolvedValue(mockValidTokens);
      jest.spyOn(validTokenService, 'remove').mockResolvedValue(undefined);

      const result = await service.resetPassword(token, resetPasswordDto);

      expect(tokenResetPasswordService.findOne).toHaveBeenCalledWith(token);
      expect(userService.findOneByEmail).toHaveBeenCalledWith(
        mockResetToken.user.email,
      );
      expect(userService.updatePassword).toHaveBeenCalledWith(
        resetPasswordDto.password,
        mockUser,
      );
      expect(tokenResetPasswordService.remove).toHaveBeenCalledWith(
        mockResetToken.id,
      );
      expect(validTokenService.findAllByUser).toHaveBeenCalledWith(mockUser.id);
      expect(validTokenService.remove).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        message: 'Mot de passe modifié avec succès',
      });
    });

    it('should throw HttpException when token does not exist', async () => {
      jest.spyOn(tokenResetPasswordService, 'findOne').mockResolvedValue(null);

      await expect(
        service.resetPassword(token, resetPasswordDto),
      ).rejects.toThrow(HttpException);
    });

    it('should throw HttpException when user does not exist', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockResetToken: any = {
        id: 1,
        token: 'reset-token',
        user: { email: 'test@example.com' },
      };
      jest
        .spyOn(tokenResetPasswordService, 'findOne')
        .mockResolvedValue(mockResetToken);
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(null);

      await expect(
        service.resetPassword(token, resetPasswordDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('logout', () => {
    const token = 'Bearer mock-token';
    const userId = 1;

    it('should logout successfully', async () => {
      jest
        .spyOn(validTokenService, 'findOne')
        .mockResolvedValue(mockValidToken);
      jest.spyOn(validTokenService, 'remove').mockResolvedValue(undefined);

      const result = await service.logout(token, userId);

      expect(validTokenService.findOne).toHaveBeenCalledWith('mock-token');
      expect(validTokenService.remove).toHaveBeenCalledWith(
        'mock-token',
        userId,
      );
      expect(result).toEqual({
        message: 'Déconnexion réussit',
      });
    });

    it('should throw HttpException when token does not exist', async () => {
      jest.spyOn(validTokenService, 'findOne').mockResolvedValue(null);

      await expect(service.logout(token, userId)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
