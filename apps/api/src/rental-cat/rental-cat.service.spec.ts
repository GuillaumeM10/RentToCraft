import { NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { type RentalCatDto } from '@rent-to-craft/dtos';

import { RentalCatEntity } from './entities/rental-cat.entity';
import { RentalCatService } from './rental-cat.service';

describe('RentalCatService', () => {
  let service: RentalCatService;

  const mockRentalCat = {
    id: 1,
    name: 'Test Category',
    description: 'Test Description',
    slug: 'test-category',
    rentals: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      getOne: jest.fn(),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      execute: jest.fn(),
    })),
    update: jest.fn(),
    delete: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalCatService,
        {
          provide: getRepositoryToken(RentalCatEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RentalCatService>(RentalCatService);

    jest.clearAllMocks();

    // Reset the createQueryBuilder mock to return a fresh mock object each time
    mockRepository.createQueryBuilder.mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      getOne: jest.fn(),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      execute: jest.fn(),
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a rental category successfully', async () => {
      const createRentalCatDto: RentalCatDto = {
        id: null,
        name: 'Test Category',
        description: 'Test Description',
        slug: 'test-category',
        rentals: null,
      };

      const expectedRentalCat = { ...mockRentalCat };

      mockRepository.create.mockReturnValue(expectedRentalCat);
      mockRepository.save.mockResolvedValue(expectedRentalCat);

      const result = await service.create(createRentalCatDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createRentalCatDto);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedRentalCat);
      expect(result).toEqual(expectedRentalCat);
    });

    it('should create a rental category with missing slug', async () => {
      const createRentalCatDto: RentalCatDto = {
        id: null,
        name: 'Test Category',
        description: 'Test Description',
        slug: 'test-category',
        rentals: null,
      };

      const expectedRentalCat = { ...mockRentalCat };

      mockRepository.create.mockReturnValue(expectedRentalCat);
      mockRepository.save.mockResolvedValue(expectedRentalCat);

      const result = await service.create(createRentalCatDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createRentalCatDto);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedRentalCat);
      expect(result).toEqual(expectedRentalCat);
    });
  });

  describe('findAll', () => {
    it('should return all rental categories', async () => {
      const expectedRentalCats = [mockRentalCat];

      const mockQueryBuilder = mockRepository.createQueryBuilder();
      mockQueryBuilder.getMany.mockResolvedValue(expectedRentalCats);

      const result = await service.findAll();

      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(expectedRentalCats);
    });

    it('should throw NotFoundException when no categories found', async () => {
      const mockQueryBuilder = mockRepository.createQueryBuilder();
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a single rental category by ID', async () => {
      const categoryId = 1;

      const mockQueryBuilder = mockRepository.createQueryBuilder();
      mockQueryBuilder.getOne.mockResolvedValue(mockRentalCat);

      const result = await service.findOne(categoryId);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(mockRentalCat);
    });

    it('should throw NotFoundException when category not found', async () => {
      const categoryId = 999;

      const mockQueryBuilder = mockRepository.createQueryBuilder();
      mockQueryBuilder.getOne.mockResolvedValue(null);

      await expect(service.findOne(categoryId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findBySlug', () => {
    it('should return a rental category by slug', async () => {
      const slug = 'test-category';

      const mockQueryBuilder = mockRepository.createQueryBuilder();
      mockQueryBuilder.getOne.mockResolvedValue(mockRentalCat);

      const result = await service.findBySlug(slug);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(mockRentalCat);
    });
  });

  describe('update', () => {
    it('should update a rental category successfully', async () => {
      const categoryId = 1;
      const updateRentalCatDto: RentalCatDto = {
        id: 1,
        name: 'Updated Category',
        description: 'Updated Description',
        slug: 'updated-category',
        rentals: null,
      };

      // Mock the findOne call that update makes
      const mockQueryBuilder = mockRepository.createQueryBuilder();
      mockQueryBuilder.getOne.mockResolvedValue(mockRentalCat);
      mockRepository.save.mockResolvedValue({
        ...mockRentalCat,
        ...updateRentalCatDto,
      });

      const result = await service.update(categoryId, updateRentalCatDto);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual({ ...mockRentalCat, ...updateRentalCatDto });
    });

    it('should throw NotFoundException when category not found', async () => {
      const categoryId = 999;
      const updateRentalCatDto: RentalCatDto = {
        id: 999,
        name: 'Updated Category',
        description: 'Updated Description',
        slug: 'updated-category',
        rentals: null,
      };

      const mockQueryBuilder = mockRepository.createQueryBuilder();
      mockQueryBuilder.getOne.mockResolvedValue(null);

      await expect(
        service.update(categoryId, updateRentalCatDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a rental category successfully', async () => {
      const categoryId = 1;

      // Mock the findOne call that remove makes
      const mockQueryBuilder = mockRepository.createQueryBuilder();
      mockQueryBuilder.getOne.mockResolvedValue(mockRentalCat);
      mockRepository.softDelete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(categoryId);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockRepository.softDelete).toHaveBeenCalledWith(categoryId);
      expect(result).toEqual({
        message: `La catégorie #${categoryId} a été supprimée.`,
      });
    });

    it('should throw NotFoundException when category not found', async () => {
      const categoryId = 999;

      const mockQueryBuilder = mockRepository.createQueryBuilder();
      mockQueryBuilder.getOne.mockResolvedValue(null);

      await expect(service.remove(categoryId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('initData', () => {
    it('should initialize rental category data', async () => {
      // Mock the findOne method that initData uses
      mockRepository.findOne.mockResolvedValue(null); // No existing category
      mockRepository.save.mockResolvedValue(mockRentalCat);

      const result = await service.initData();

      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });
});
