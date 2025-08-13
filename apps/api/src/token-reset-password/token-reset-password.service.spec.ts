import { HttpException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  type CreateTokenResetPasswordDto,
  type ValidtokenDto,
} from '@rent-to-craft/dtos';
import { type Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { createMockUser } from '../test-helpers/user-mock.helper';
import { UserService } from '../user/user.service';
import { TokenResetPasswordEntity } from './entities/token-reset-password.entity';
import { TokenResetPasswordService } from './token-reset-password.service';

jest.mock('uuid');

describe('TokenResetPasswordService', () => {
  let service: TokenResetPasswordService;
  let tokenRepository: jest.Mocked<Repository<TokenResetPasswordEntity>>;
  let userService: jest.Mocked<UserService>;

  const mockUser = createMockUser();

  const mockToken: TokenResetPasswordEntity = {
    id: 1,
    token: 'test-token-uuid',
    user: mockUser as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenResetPasswordService,
        {
          provide: getRepositoryToken(TokenResetPasswordEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findOneByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TokenResetPasswordService>(TokenResetPasswordService);
    tokenRepository = module.get(getRepositoryToken(TokenResetPasswordEntity));
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateTokenResetPasswordDto = {
      email: 'test@example.com',
    };

    it('should create a new token when user exists and no token found', async () => {
      const mockUuid = 'new-token-uuid';
      (uuidv4 as jest.Mock).mockReturnValue(mockUuid);

      userService.findOneByEmail.mockResolvedValue(mockUser);
      jest.spyOn(service, 'findOneByEmail').mockResolvedValue(null);
      tokenRepository.create.mockReturnValue(mockToken);
      tokenRepository.save.mockResolvedValue(mockToken);

      const result = await service.create(createDto);

      expect(userService.findOneByEmail).toHaveBeenCalledWith(createDto.email);
      expect(service.findOneByEmail).toHaveBeenCalledWith(createDto.email);
      expect(tokenRepository.create).toHaveBeenCalledWith({
        token: mockUuid,
        user: mockUser,
      });
      expect(tokenRepository.save).toHaveBeenCalledWith(mockToken);
      expect(result).toBeDefined();
    });

    it('should return existing token when user already has one', async () => {
      const existingToken: ValidtokenDto = {
        id: 1,
        token: 'existing-token',
        user: mockUser,
      };

      userService.findOneByEmail.mockResolvedValue(mockUser);
      jest.spyOn(service, 'findOneByEmail').mockResolvedValue(existingToken);

      const result = await service.create(createDto);

      expect(result).toEqual(existingToken);
      expect(tokenRepository.create).not.toHaveBeenCalled();
    });

    it('should throw HttpException when user does not exist', async () => {
      userService.findOneByEmail.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(HttpException);
      await expect(service.create(createDto)).rejects.toThrow(
        "Cet utilisateur n'existe pas.",
      );
    });

    it('should handle repository save errors', async () => {
      const mockUuid = 'new-token-uuid';
      (uuidv4 as jest.Mock).mockReturnValue(mockUuid);

      userService.findOneByEmail.mockResolvedValue(mockUser);
      jest.spyOn(service, 'findOneByEmail').mockResolvedValue(null);
      tokenRepository.create.mockReturnValue(mockToken);
      tokenRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createDto)).rejects.toThrow('Database error');
    });

    it('should handle findOneByEmail errors during create', async () => {
      userService.findOneByEmail.mockResolvedValue(mockUser);
      jest
        .spyOn(service, 'findOneByEmail')
        .mockRejectedValue(new Error('Find token error'));

      await expect(service.create(createDto)).rejects.toThrow(
        'Find token error',
      );
    });
  });

  describe('findOneByEmail', () => {
    it('should find token by user email', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockToken),
      };

      userService.findOneByEmail.mockResolvedValue(mockUser);
      tokenRepository.createQueryBuilder.mockReturnValue(queryBuilder as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const result = await service.findOneByEmail('test@example.com');

      expect(userService.findOneByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'resetPasswordToken.user',
        'user',
      );
      expect(queryBuilder.where).toHaveBeenCalledWith('user.email = :email', {
        email: 'test@example.com',
      });
      expect(result).toBeDefined();
    });

    it('should throw HttpException when user does not exist', async () => {
      userService.findOneByEmail.mockResolvedValue(null);

      await expect(
        service.findOneByEmail('notfound@example.com'),
      ).rejects.toThrow(HttpException);
      await expect(
        service.findOneByEmail('notfound@example.com'),
      ).rejects.toThrow("Cet utilisateur n'existe pas.");
    });

    it('should handle query builder errors', async () => {
      const error = new Error('Query builder error');
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockRejectedValue(error),
      };

      userService.findOneByEmail.mockResolvedValue(mockUser);
      tokenRepository.createQueryBuilder.mockReturnValue(queryBuilder as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      await expect(service.findOneByEmail('test@example.com')).rejects.toThrow(
        'Query builder error',
      );
    });
  });

  describe('findOne', () => {
    it('should find token by token string', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockToken),
      };

      tokenRepository.createQueryBuilder.mockReturnValue(queryBuilder as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const result = await service.findOne('test-token-uuid');

      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'resetPasswordToken.user',
        'user',
      );
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'resetPasswordToken.token = :token',
        { token: 'test-token-uuid' },
      );
      expect(result).toBeDefined();
    });

    it('should return null when token not found', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };

      tokenRepository.createQueryBuilder.mockReturnValue(queryBuilder as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const result = await service.findOne('nonexistent-token');

      expect(result).toBeNull();
    });

    it('should handle query builder errors', async () => {
      const error = new Error('Query builder error');
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockRejectedValue(error),
      };

      tokenRepository.createQueryBuilder.mockReturnValue(queryBuilder as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      await expect(service.findOne('test-token-uuid')).rejects.toThrow(
        'Query builder error',
      );
    });
  });

  describe('remove', () => {
    it('should remove token successfully', async () => {
      tokenRepository.delete.mockResolvedValue({ affected: 1, raw: [] });

      const result = await service.remove(1);

      expect(tokenRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(
        expect.objectContaining({
          message: 'Token supprimé',
        }),
      );
    });

    it('should throw HttpException when deletion fails', async () => {
      const error = new Error('Database error');
      tokenRepository.delete.mockRejectedValue(error);
      jest.spyOn(console, 'log').mockImplementation(() => {});

      await expect(service.remove(1)).rejects.toThrow(HttpException);
      await expect(service.remove(1)).rejects.toThrow(
        'Erreur lors de la suppresion du token',
      );

      expect(console.log).toHaveBeenCalledWith(error);
    });
  });

  describe('clearUserTokens', () => {
    it('should clear all tokens for a user', async () => {
      tokenRepository.delete.mockResolvedValue({ affected: 2, raw: [] });

      const result = await service.clearUserTokens(1);

      expect(tokenRepository.delete).toHaveBeenCalledWith({ user: { id: 1 } });
      expect(result).toEqual(
        expect.objectContaining({
          message:
            "L'utilisateur 1 n'a plus de token pour les mot de passe oublié",
        }),
      );
    });

    it('should work even when no tokens exist for user', async () => {
      tokenRepository.delete.mockResolvedValue({ affected: 0, raw: [] });

      const result = await service.clearUserTokens(999);

      expect(tokenRepository.delete).toHaveBeenCalledWith({
        user: { id: 999 },
      });
      expect(result).toBeDefined();
    });

    it('should handle repository delete errors', async () => {
      const error = new Error('Database error');
      tokenRepository.delete.mockRejectedValue(error);

      await expect(service.clearUserTokens(1)).rejects.toThrow(
        'Database error',
      );
    });
  });
});
