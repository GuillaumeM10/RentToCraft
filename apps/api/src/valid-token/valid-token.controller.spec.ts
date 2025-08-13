import { Test, type TestingModule } from '@nestjs/testing';
import { type CreateValidTokenDto } from '@rent-to-craft/dtos';

import { createMockUser } from '../test-helpers/user-mock.helper';
import { ValidTokenController } from './valid-token.controller';
import { ValidTokenService } from './valid-token.service';

describe('ValidTokenController', () => {
  let controller: ValidTokenController;
  let service: jest.Mocked<ValidTokenService>;

  const mockUser = createMockUser();

  const mockValidToken = {
    id: 1,
    token: 'test-jwt-token',
    user: { id: 1 } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValidTokenController],
      providers: [
        {
          provide: ValidTokenService,
          useValue: {
            create: jest.fn(),
            findAllByUser: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ValidTokenController>(ValidTokenController);
    service = module.get(ValidTokenService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a valid token', async () => {
      const createDto: CreateValidTokenDto = {
        token: 'new-jwt-token',
        user: mockUser,
      };

      service.create.mockResolvedValue(mockValidToken);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockValidToken);
    });

    it('should handle service errors', async () => {
      const createDto: CreateValidTokenDto = {
        token: 'duplicate-token',
        user: mockUser,
      };

      service.create.mockRejectedValue(new Error('Error while creating validToken'));

      await expect(controller.create(createDto)).rejects.toThrow('Error while creating validToken');
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should handle database errors', async () => {
      const createDto: CreateValidTokenDto = {
        token: 'new-jwt-token',
        user: mockUser,
      };

      service.create.mockRejectedValue(new Error('Database connection failed'));

      await expect(controller.create(createDto)).rejects.toThrow('Database connection failed');
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAllByUser', () => {
    it('should find all tokens for a user', async () => {
      const mockTokens = [mockValidToken];
      service.findAllByUser.mockResolvedValue(mockTokens);

      const result = await controller.findAllByUser(1);

      expect(service.findAllByUser).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTokens);
    });

    it('should return empty array when no tokens found', async () => {
      service.findAllByUser.mockResolvedValue([]);

      const result = await controller.findAllByUser(1);

      expect(service.findAllByUser).toHaveBeenCalledWith(1);
      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      service.findAllByUser.mockRejectedValue(new Error('Error while fetching validToken'));

      await expect(controller.findAllByUser(null)).rejects.toThrow('Error while fetching validToken');
      expect(service.findAllByUser).toHaveBeenCalledWith(null);
    });

    it('should handle database errors', async () => {
      service.findAllByUser.mockRejectedValue(new Error('Database connection failed'));

      await expect(controller.findAllByUser(1)).rejects.toThrow('Database connection failed');
      expect(service.findAllByUser).toHaveBeenCalledWith(1);
    });
  });

  describe('findOne', () => {
    it('should find a token by token string', async () => {
      service.findOne.mockResolvedValue(mockValidToken);

      const result = await controller.findOne('test-jwt-token');

      expect(service.findOne).toHaveBeenCalledWith('test-jwt-token');
      expect(result).toEqual(mockValidToken);
    });

    it('should return null when token not found', async () => {
      service.findOne.mockResolvedValue(null);

      const result = await controller.findOne('nonexistent-token');

      expect(service.findOne).toHaveBeenCalledWith('nonexistent-token');
      expect(result).toBeNull();
    });

    it('should handle empty token string', async () => {
      service.findOne.mockResolvedValue(null);

      const result = await controller.findOne('');

      expect(service.findOne).toHaveBeenCalledWith('');
      expect(result).toBeNull();
    });

    it('should handle service errors', async () => {
      service.findOne.mockRejectedValue(new Error('Error while fetching validToken'));

      await expect(controller.findOne('invalid-token')).rejects.toThrow('Error while fetching validToken');
      expect(service.findOne).toHaveBeenCalledWith('invalid-token');
    });

    it('should handle database errors', async () => {
      service.findOne.mockRejectedValue(new Error('Database connection failed'));

      await expect(controller.findOne('test-token')).rejects.toThrow('Database connection failed');
      expect(service.findOne).toHaveBeenCalledWith('test-token');
    });
  });

  describe('remove', () => {
    it('should remove a token', async () => {
      const mockResponse = { message: 'Token supprimé' };
      service.remove.mockResolvedValue(mockResponse);

      const result = await controller.remove('test-jwt-token', mockUser);

      expect(service.remove).toHaveBeenCalledWith('test-jwt-token', mockUser.id);
      expect(result).toEqual(mockResponse);
    });

    it('should handle service errors during removal', async () => {
      service.remove.mockRejectedValue(new Error('Error while removing validToken'));

      await expect(controller.remove('test-token', mockUser)).rejects.toThrow('Error while removing validToken');
      expect(service.remove).toHaveBeenCalledWith('test-token', mockUser.id);
    });

    it('should pass correct user ID from user decorator', async () => {
      const mockResponse = { message: 'Token supprimé' };
      const customUser = { ...mockUser, id: 999 };
      service.remove.mockResolvedValue(mockResponse);

      await controller.remove('test-token', customUser);

      expect(service.remove).toHaveBeenCalledWith('test-token', 999);
    });

    it('should handle empty token string', async () => {
      const mockResponse = { message: 'Token supprimé' };
      service.remove.mockResolvedValue(mockResponse);

      await controller.remove('', mockUser);

      expect(service.remove).toHaveBeenCalledWith('', mockUser.id);
    });

    it('should handle database errors during removal', async () => {
      service.remove.mockRejectedValue(new Error('Database connection failed'));

      await expect(controller.remove('test-token', mockUser)).rejects.toThrow('Database connection failed');
      expect(service.remove).toHaveBeenCalledWith('test-token', mockUser.id);
    });
  });
});
