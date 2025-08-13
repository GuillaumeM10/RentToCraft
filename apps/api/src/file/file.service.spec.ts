import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { type FileDto } from '@rent-to-craft/dtos';

import { RentalService } from '../rental/rental.service';
import { UserService } from '../user/user.service';
import { FileEntity } from './entities/file.entity';
import { FileService } from './file.service';

describe('FileService', () => {
  let service: FileService;

  const mockFile = {
    id: 1,
    name: 'test.webp',
    file: 'base64-encoded-data',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockFiles = [mockFile];

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockFiles),
    })),
    remove: jest.fn(),
  };

  const mockUserService = {
    getAllFilesIds: jest.fn().mockResolvedValue([1, 2, 3]),
  };

  const mockRentalService = {
    getAllFilesIds: jest.fn().mockResolvedValue([4, 5]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: getRepositoryToken(FileEntity),
          useValue: mockRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: RentalService,
          useValue: mockRentalService,
        },
      ],
    }).compile();

    service = module.get<FileService>(FileService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMultiples', () => {
    it('should find multiple files by array of IDs', async () => {
      const result = await service.findMultiples([1, 2, 3]);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should return a single file', async () => {
      const fileId = 1;

      mockRepository.findOne.mockResolvedValue(mockFile);

      const result = await service.findOne(fileId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: fileId },
      });
      expect(result).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update a file successfully', async () => {
      const fileId = 1;
      const updateFileDto: FileDto = {
        id: 1,
        name: 'updated.webp',
        file: 'updated-base64-data',
      };

      mockRepository.findOne.mockResolvedValue(mockFile);
      mockRepository.save.mockResolvedValue({ ...mockFile, ...updateFileDto });

      const result = await service.update(fileId, updateFileDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: fileId },
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('remove', () => {
    it('should remove a file successfully', async () => {
      const fileId = 1;

      mockRepository.findOne.mockResolvedValue(mockFile);
      mockRepository.remove.mockResolvedValue(undefined);

      const result = await service.remove(fileId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: fileId },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockFile);
      expect(result).toEqual({
        message: `File with ID ${fileId} deleted successfully`,
      });
    });
  });

  describe('clearNotUsedFiles', () => {
    it('should clear unused files', async () => {
      const mockUnusedFiles = [mockFile];

      mockRepository
        .createQueryBuilder()
        .getMany.mockResolvedValue(mockUnusedFiles);
      mockRepository.remove.mockResolvedValue(undefined);

      const result = await service.clearNotUsedFiles();

      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockRepository.remove).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
