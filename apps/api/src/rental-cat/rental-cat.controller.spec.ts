import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import { type RentalCatDto } from '@rent-to-craft/dtos';

import { AuthGuard } from '../auth/guard/jwt-passport.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { ValidTokenService } from '../valid-token/valid-token.service';
import { RentalCatController } from './rental-cat.controller';
import { RentalCatService } from './rental-cat.service';

describe('RentalCatController', () => {
  let controller: RentalCatController;
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

  const mockRentalCatService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findBySlug: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    initData: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockValidTokenService = {
    findByToken: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalCatController],
      providers: [
        {
          provide: RentalCatService,
          useValue: mockRentalCatService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ValidTokenService,
          useValue: mockValidTokenService,
        },
        Reflector,
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<RentalCatController>(RentalCatController);
    service = module.get<RentalCatService>(RentalCatService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have service', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a rental category', async () => {
      const createRentalCatDto: RentalCatDto = {
        id: null,
        name: 'Test Category',
        description: 'Test Description',
        slug: 'test-category',
        rentals: null,
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockRentalCat as never);

      const result = await controller.create(createRentalCatDto);

      expect(result).toEqual(mockRentalCat);
      expect(service.create).toHaveBeenCalledWith(createRentalCatDto);
    });
  });

  describe('findAll', () => {
    it('should return all rental categories', async () => {
      const mockRentalCats = [mockRentalCat];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockRentalCats as never);

      const result = await controller.findAll();

      expect(result).toEqual(mockRentalCats);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single rental category', async () => {
      jest
        .spyOn(service, 'findBySlug')
        .mockResolvedValue(mockRentalCat as never);

      const result = await controller.findOne('test-category');

      expect(result).toEqual(mockRentalCat);
      expect(service.findBySlug).toHaveBeenCalledWith('test-category');
    });
  });

  describe('update', () => {
    it('should update a rental category', async () => {
      const updateRentalCatDto: RentalCatDto = {
        id: 1,
        name: 'Updated Category',
        description: 'Updated Description',
        slug: 'updated-category',
        rentals: [],
      };

      const updatedRentalCat = { ...mockRentalCat, ...updateRentalCatDto };

      jest.spyOn(service, 'update').mockResolvedValue(updatedRentalCat);

      const result = await controller.update(1, updateRentalCatDto);

      expect(result).toEqual(updatedRentalCat);
      expect(service.update).toHaveBeenCalledWith(1, updateRentalCatDto);
    });
  });

  describe('remove', () => {
    it('should remove a rental category', async () => {
      const removeResult = {
        message: 'La catégorie #1 a été supprimée.',
      };

      jest.spyOn(service, 'remove').mockResolvedValue(removeResult);

      const result = await controller.remove(1);

      expect(result).toEqual(removeResult);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
