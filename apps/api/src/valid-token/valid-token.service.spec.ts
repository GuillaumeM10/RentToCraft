import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { type CreateValidTokenDto } from '@rent-to-craft/dtos';
import { type Repository } from 'typeorm';

import { ValidTokenEntity } from './entities/valid-token.entity';
import { ValidTokenService } from './valid-token.service';

describe('ValidTokenService', () => {
  let service: ValidTokenService;
  let repository: jest.Mocked<Repository<ValidTokenEntity>>;

  const mockValidToken: ValidTokenEntity = {
    id: 1,
    token: 'test-jwt-token',
    user: { id: 1 } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidTokenService,
        {
          provide: getRepositoryToken(ValidTokenEntity),
          useValue: {
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ValidTokenService>(ValidTokenService);
    repository = module.get(getRepositoryToken(ValidTokenEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateValidTokenDto = {
      token: 'new-jwt-token',
      user: { id: 1 } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    };

    it('should create a valid token successfully', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      repository.save.mockResolvedValue(mockValidToken);

      const result = await service.create(createDto);

      expect(service.findOne).toHaveBeenCalledWith(createDto.token);
      expect(repository.save).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockValidToken);
    });

    it('should throw error when user is missing', async () => {
      const invalidDto = { ...createDto, user: null };

      await expect(service.create(invalidDto)).rejects.toThrow('Error while creating validToken');
    });

    it('should throw error when user is undefined', async () => {
      const invalidDto = { ...createDto, user: undefined };

      await expect(service.create(invalidDto)).rejects.toThrow('Error while creating validToken');
    });

    it('should throw error when token is missing', async () => {
      const invalidDto = { ...createDto, token: null };

      await expect(service.create(invalidDto)).rejects.toThrow('Error while creating validToken');
    });

    it('should throw error when token is undefined', async () => {
      const invalidDto = { ...createDto, token: undefined };

      await expect(service.create(invalidDto)).rejects.toThrow('Error while creating validToken');
    });

    it('should throw error when token is empty string', async () => {
      const invalidDto = { ...createDto, token: '' };

      await expect(service.create(invalidDto)).rejects.toThrow('Error while creating validToken');
    });

    it('should throw error when token already exists', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockValidToken);

      await expect(service.create(createDto)).rejects.toThrow('Error while creating validToken');
    });

    it('should throw error when database operation fails', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      repository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createDto)).rejects.toThrow('Error while creating validToken');
    });

    it('should throw error when findOne throws error', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new Error('FindOne error'));

      await expect(service.create(createDto)).rejects.toThrow('Error while creating validToken');
    });
  });

  describe('findAllByUser', () => {
    it('should find all tokens for a user', async () => {
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockValidToken]),
      };
      repository.createQueryBuilder.mockReturnValue(queryBuilder as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const result = await service.findAllByUser(1);

      expect(queryBuilder.where).toHaveBeenCalledWith('validToken.user = :userId', { userId: 1 });
      expect(result).toEqual([mockValidToken]);
    });

    it('should return empty array when no tokens found', async () => {
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      repository.createQueryBuilder.mockReturnValue(queryBuilder as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const result = await service.findAllByUser(1);

      expect(result).toEqual([]);
    });

    it('should throw error when userId is missing', async () => {
      await expect(service.findAllByUser(null)).rejects.toThrow('Error while fetching validToken');
    });

    it('should throw error when userId is undefined', async () => {
      await expect(service.findAllByUser(undefined)).rejects.toThrow('Error while fetching validToken');
    });

    it('should throw error when userId is zero', async () => {
      await expect(service.findAllByUser(0)).rejects.toThrow('Error while fetching validToken');
    });

    it('should throw error when database operation fails', async () => {
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockRejectedValue(new Error('Database error')),
      };
      repository.createQueryBuilder.mockReturnValue(queryBuilder as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      await expect(service.findAllByUser(1)).rejects.toThrow('Error while fetching validToken');
    });
  });

  describe('findOne', () => {
    it('should find a token by token string', async () => {
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockValidToken),
      };
      repository.createQueryBuilder.mockReturnValue(queryBuilder as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const result = await service.findOne('test-jwt-token');

      expect(queryBuilder.where).toHaveBeenCalledWith('validToken.token = :token', { token: 'test-jwt-token' });
      expect(result).toEqual(mockValidToken);
    });

    it('should return null when token not found', async () => {
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      repository.createQueryBuilder.mockReturnValue(queryBuilder as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const result = await service.findOne('nonexistent-token');

      expect(result).toBeNull();
    });

    it('should throw error when token is missing', async () => {
      await expect(service.findOne(null)).rejects.toThrow('Error while fetching validToken');
    });

    it('should throw error when database operation fails', async () => {
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockRejectedValue(new Error('Database error')),
      };
      repository.createQueryBuilder.mockReturnValue(queryBuilder as any); // eslint-disable-line @typescript-eslint/no-explicit-any
      jest.spyOn(console, 'log').mockImplementation(() => {});

      await expect(service.findOne('test-token')).rejects.toThrow('Error while fetching validToken');
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a token successfully', async () => {
      const queryBuilder = {
        delete: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ affected: 1 }),
      };
      repository.createQueryBuilder.mockReturnValue(queryBuilder as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const result = await service.remove('test-token', 1);

      expect(queryBuilder.delete).toHaveBeenCalled();
      expect(queryBuilder.from).toHaveBeenCalledWith(ValidTokenEntity);
      expect(queryBuilder.where).toHaveBeenCalledWith('token = :token', { token: 'test-token' });
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('user = :userId', { userId: 1 });
      expect(result).toEqual({ message: 'Token supprimé' });
    });

    it('should remove token even when no rows affected', async () => {
      const queryBuilder = {
        delete: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ affected: 0 }),
      };
      repository.createQueryBuilder.mockReturnValue(queryBuilder as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const result = await service.remove('test-token', 1);

      expect(result).toEqual({ message: 'Token supprimé' });
    });

    it('should throw error when token is missing', async () => {
      await expect(service.remove(null, 1)).rejects.toThrow('Error while removing validToken');
    });

    it('should throw error when token is undefined', async () => {
      await expect(service.remove(undefined, 1)).rejects.toThrow('Error while removing validToken');
    });

    it('should throw error when token is empty string', async () => {
      await expect(service.remove('', 1)).rejects.toThrow('Error while removing validToken');
    });

    it('should throw error when userId is missing', async () => {
      await expect(service.remove('test-token', null)).rejects.toThrow('Error while removing validToken');
    });

    it('should throw error when userId is undefined', async () => {
      await expect(service.remove('test-token', undefined)).rejects.toThrow('Error while removing validToken');
    });

    it('should throw error when userId is zero', async () => {
      await expect(service.remove('test-token', 0)).rejects.toThrow('Error while removing validToken');
    });

    it('should throw error when database operation fails', async () => {
      const queryBuilder = {
        delete: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        execute: jest.fn().mockRejectedValue(new Error('Database error')),
      };
      repository.createQueryBuilder.mockReturnValue(queryBuilder as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      await expect(service.remove('test-token', 1)).rejects.toThrow('Error while removing validToken');
    });
  });
});
