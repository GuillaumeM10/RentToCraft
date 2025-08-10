import {
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { type SignupAuthDto } from '@rent-to-craft/dtos';
import * as bcrypt from 'bcryptjs';
import { type Repository } from 'typeorm';

import { FileService } from '../file/file.service';
import { createMockUser, createMockUserEntity, createMockUserUpdateDto } from '../test-helpers/user-mock.helper';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

jest.mock('bcryptjs');

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<Repository<UserEntity>>;
  let fileService: jest.Mocked<FileService>;

  const mockUser = createMockUserEntity();

  const mockUserDto = createMockUser();

  beforeEach(async () => {
    const mockRepository = {
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      softDelete: jest.fn(),
      findOneBy: jest.fn(),
    };

    const mockFileService = {
      create: jest.fn(),
      findOne: jest.fn(),
      getAllFilesIds: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockRepository,
        },
        {
          provide: FileService,
          useValue: mockFileService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(UserEntity)) as jest.Mocked<Repository<UserEntity>>;
    fileService = module.get(FileService) as jest.Mocked<FileService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: SignupAuthDto = {
      email: 'newuser@example.com',
      password: 'password123', // eslint-disable-line sonarjs/no-hardcoded-credentials
      firstName: 'New',
      lastName: 'User',
    };

    it('should create a user successfully', async () => {
      (bcrypt.hashSync as jest.Mock).mockReturnValue('hashedPassword'); // eslint-disable-line sonarjs/no-hardcoded-credentials
      userRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(bcrypt.hashSync).toHaveBeenCalledWith('password123', 10);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword', // eslint-disable-line sonarjs/no-hardcoded-credentials
      });
      expect(result).toBeDefined();
    });

    it('should throw HttpException if password is missing', async () => {
      const invalidDto = { ...createUserDto, password: undefined };

      await expect(service.create(invalidDto)).rejects.toThrow(HttpException);
      await expect(service.create(invalidDto)).rejects.toThrow(
        'Toutes les informations ne sont pas renseignées.',
      );
    });

    it('should throw HttpException if email is missing', async () => {
      const invalidDto = { ...createUserDto, email: '' };

      await expect(service.create(invalidDto)).rejects.toThrow(HttpException);
      await expect(service.create(invalidDto)).rejects.toThrow('Email obligatoire.');
    });
  });

  describe('findAll', () => {
    it('should return all users with pagination', async () => {
      const queryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockUser]),
      };
      userRepository.createQueryBuilder.mockReturnValue(queryBuilder as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(queryBuilder.skip).toHaveBeenCalledWith(10);
      expect(queryBuilder.take).toHaveBeenCalledWith(10);
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('user.id', 'DESC');
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('user.profilePicture', 'profilePicture');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should throw NotFoundException when no users found', async () => {
      const queryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      userRepository.createQueryBuilder.mockReturnValue(queryBuilder as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      await expect(service.findAll({})).rejects.toThrow(NotFoundException);
      await expect(service.findAll({})).rejects.toThrow('Pas de résultats');
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      };
      userRepository.createQueryBuilder.mockReturnValue(queryBuilder as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const result = await service.findOne(1);

      expect(queryBuilder.where).toHaveBeenCalledWith('user.id = :id', { id: 1 });
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when user not found', async () => {
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      userRepository.createQueryBuilder.mockReturnValue(queryBuilder as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        "Impossible de trouver l'utilisateur #999.",
      );
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      };
      userRepository.createQueryBuilder.mockReturnValue(queryBuilder as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const result = await service.findOneByEmail('test@example.com');

      expect(queryBuilder.where).toHaveBeenCalledWith('user.email = :email', {
        email: 'test@example.com',
      });
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when user not found by email', async () => {
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      userRepository.createQueryBuilder.mockReturnValue(queryBuilder as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      await expect(service.findOneByEmail('notfound@example.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateDto = createMockUserUpdateDto({
      firstName: 'Updated',
      lastName: 'Name',
    });

    it('should update user successfully', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUserDto);
      userRepository.save.mockResolvedValue(mockUser);

      const result = await service.update(updateDto, mockUserDto, 1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(userRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should hash password if provided in update', async () => {
      const updateWithPassword = { ...updateDto, password: 'newPassword' }; // eslint-disable-line sonarjs/no-hardcoded-credentials
      (bcrypt.hashSync as jest.Mock).mockReturnValue('newHashedPassword');
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUserDto);
      userRepository.save.mockResolvedValue(mockUser);

      await service.update(updateWithPassword, mockUserDto, 1);

      expect(bcrypt.hashSync).toHaveBeenCalledWith('newPassword', 10);
    });

    it('should throw UnauthorizedException when user tries to update another user', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUserDto);

      await expect(service.update(updateDto, mockUserDto, 2)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should convert string isPublic to boolean', async () => {
      const updateWithIsPublic = { ...updateDto, isPublic: 'true' as unknown as boolean };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUserDto);
      userRepository.save.mockResolvedValue(mockUser);

      await service.update(updateWithIsPublic, mockUserDto, 1);

      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ isPublic: true }),
      );
    });
  });

  describe('deleteFile', () => {
    it('should delete profile picture successfully', async () => {
      const userWithPicture = { ...mockUserDto, profilePicture: { id: 1, file: 'test', name: 'test' } };
      jest.spyOn(service, 'findOne').mockResolvedValue(userWithPicture);
      userRepository.save.mockResolvedValue(mockUser);

      const result = await service.deleteFile('profilePicture', mockUserDto);

      expect(userRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when file type not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUserDto);

      await expect(service.deleteFile('profilePicture', mockUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('uploadFile', () => {
    const mockFile = { filename: 'test.jpg' } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

    it('should upload profile picture successfully', async () => {
      const mockUploadedFile = { id: 1, filename: 'test.jpg', file: 'test', name: 'test' };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUserDto);
      fileService.create.mockResolvedValue(mockUploadedFile);
      userRepository.save.mockResolvedValue(mockUser);

      const result = await service.uploadFile('profilePicture', mockFile, mockUserDto);

      expect(fileService.create).toHaveBeenCalledWith(mockFile);
      expect(userRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException for invalid file type', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUserDto);

      await expect(
        service.uploadFile('invalid' as 'banner' | 'profilePicture', mockFile, mockUserDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserPassword', () => {
    it('should return user password', async () => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({ id: 1, password: 'hashedPassword' }), // eslint-disable-line sonarjs/no-hardcoded-credentials
      };
      userRepository.createQueryBuilder.mockReturnValue(queryBuilder as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const result = await service.getUserPassword('test@example.com');

      expect(result).toBe('hashedPassword');
    });

    it('should throw NotFoundException when user not found', async () => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      userRepository.createQueryBuilder.mockReturnValue(queryBuilder as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      await expect(service.getUserPassword('notfound@example.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updatePassword', () => {
    it('should update user password successfully', async () => {
      (bcrypt.hashSync as jest.Mock).mockReturnValue('newHashedPassword');
      jest.spyOn(service, 'findOneByEmail').mockResolvedValue(mockUserDto);
      userRepository.save.mockResolvedValue(mockUser);

      const result = await service.updatePassword('newPassword', mockUserDto);

      expect(bcrypt.hashSync).toHaveBeenCalledWith('newPassword', 10);
      expect(userRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('softDelete', () => {
    it('should soft delete user successfully', async () => {
      const userToDelete = { ...mockUserDto, id: 2 };
      jest.spyOn(service, 'findOne').mockResolvedValue(userToDelete);
      userRepository.softDelete.mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });

      const result = await service.softDelete(2, mockUserDto);

      expect(userRepository.softDelete).toHaveBeenCalledWith(2);
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when user tries to delete themselves', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUserDto);

      await expect(service.softDelete(1, mockUserDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.softDelete(1, mockUserDto)).rejects.toThrow(
        'Impossible de supprimer votre compte.',
      );
    });
  });

  describe('getAllFilesIds', () => {
    it('should return all file IDs from users', async () => {
      const usersWithFiles = [
        { profilePicture: { id: 1 }, banner: { id: 2 } },
        { profilePicture: { id: 3 }, banner: null },
        { profilePicture: null, banner: { id: 4 } },
      ];
      userRepository.find.mockResolvedValue(usersWithFiles as UserEntity[]);

      const result = await service.getAllFilesIds();

      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should return empty array when no files found', async () => {
      userRepository.find.mockResolvedValue([]);

      const result = await service.getAllFilesIds();

      expect(result).toEqual([]);
    });
  });
});
