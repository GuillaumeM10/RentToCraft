import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';

import { createMockUser, createMockUserUpdateDto } from '../test-helpers/user-mock.helper';
import { ValidTokenService } from '../valid-token/valid-token.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  const mockUserDto = createMockUser();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            uploadFile: jest.fn(),
            deleteFile: jest.fn(),
            softDelete: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ValidTokenService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        Reflector,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      userService.create.mockResolvedValue(mockUserDto);

      const result = await controller.create(mockUserDto);

      expect(userService.create).toHaveBeenCalledWith(mockUserDto);
      expect(result).toEqual(mockUserDto);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [mockUserDto];
      const queries = { page: 0, limit: 10 };
      userService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll(queries);

      expect(userService.findAll).toHaveBeenCalledWith(queries);
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      userService.findOne.mockResolvedValue(mockUserDto);

      const result = await controller.findOne(1);

      expect(userService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUserDto);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateDto = createMockUserUpdateDto({ firstName: 'Updated' });
      const updatedUser = { ...mockUserDto, firstName: 'Updated' };
      userService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(updateDto, mockUserDto, 1);

      expect(userService.update).toHaveBeenCalledWith(updateDto, mockUserDto, 1);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('uploadFile', () => {
    it('should upload a profile picture', async () => {
      const mockFile = { filename: 'test.jpg' } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      const files = { file: [mockFile] };
      const mockResponse = { message: 'File uploaded successfully' };
      userService.uploadFile.mockResolvedValue(mockResponse);

      const result = await controller.uploadFile(files, mockUserDto, 'profilePicture');

      expect(userService.uploadFile).toHaveBeenCalledWith(
        'profilePicture',
        mockFile,
        mockUserDto,
      );
      expect(result).toEqual(mockResponse);
    });

    it('should upload a banner', async () => {
      const mockFile = { filename: 'banner.jpg' } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      const files = { file: [mockFile] };
      const mockResponse = { message: 'File uploaded successfully' };
      userService.uploadFile.mockResolvedValue(mockResponse);

      const result = await controller.uploadFile(files, mockUserDto, 'banner');

      expect(userService.uploadFile).toHaveBeenCalledWith('banner', mockFile, mockUserDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteFile', () => {
    it('should delete a profile picture', async () => {
      const updatedUser = { ...mockUserDto, profilePicture: null };
      userService.deleteFile.mockResolvedValue(updatedUser);

      const result = await controller.deleteFile('profilePicture', mockUserDto);

      expect(userService.deleteFile).toHaveBeenCalledWith('profilePicture', mockUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('should delete a banner', async () => {
      const updatedUser = { ...mockUserDto, banner: null };
      userService.deleteFile.mockResolvedValue(updatedUser);

      const result = await controller.deleteFile('banner', mockUserDto);

      expect(userService.deleteFile).toHaveBeenCalledWith('banner', mockUserDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('softDelete', () => {
    it('should soft delete a user', async () => {
      const mockResponse = { message: "L'utilisateur #2 a été supprimé." };
      userService.softDelete.mockResolvedValue(mockResponse);

      const result = await controller.softDelete(2, mockUserDto);

      expect(userService.softDelete).toHaveBeenCalledWith(2, mockUserDto);
      expect(result).toEqual(mockResponse);
    });
  });
});
