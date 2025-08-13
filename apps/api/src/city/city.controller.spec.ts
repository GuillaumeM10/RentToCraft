import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import { type CityDto } from '@rent-to-craft/dtos';

import { ValidTokenService } from '../valid-token/valid-token.service';
import { CityController } from './city.controller';
import { CityService } from './city.service';

describe('CityController', () => {
  let controller: CityController;
  let cityService: CityService;

  const mockCity = {
    id: 1,
    name: 'Test City',
    slug: 'test-city',
    latitude: 48.8566,
    longitude: 2.3522,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockCities = [mockCity];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CityController],
      providers: [
        {
          provide: CityService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            search: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
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
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CityController>(CityController);
    cityService = module.get<CityService>(CityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a city', async () => {
      const createCityDto: CityDto = {
        id: null,
        name: 'Test City',
        slug: 'test-city',
        latitude: 48.8566,
        longitude: 2.3522,
      };

      jest.spyOn(cityService, 'create').mockResolvedValue(mockCity as never);

      const result = await controller.create(createCityDto);

      expect(result).toEqual(mockCity);
      expect(cityService.create).toHaveBeenCalledWith(createCityDto);
    });
  });

  describe('findAll', () => {
    it('should return all cities', async () => {
      jest.spyOn(cityService, 'findAll').mockResolvedValue(mockCities as never);

      const result = await controller.findAll();

      expect(result).toEqual(mockCities);
      expect(cityService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single city', async () => {
      jest.spyOn(cityService, 'findOne').mockResolvedValue(mockCity as never);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockCity);
      expect(cityService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('search', () => {
    it('should search cities', async () => {
      jest.spyOn(cityService, 'search').mockResolvedValue(mockCities as never);

      const result = await controller.search('test');

      expect(result).toEqual(mockCities);
      expect(cityService.search).toHaveBeenCalledWith('test');
    });
  });

  describe('update', () => {
    it('should update a city', async () => {
      const updateCityDto: CityDto = {
        id: 1,
        name: 'Updated City',
        slug: 'updated-city',
        latitude: 48.8566,
        longitude: 2.3522,
      };

      const updateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      jest.spyOn(cityService, 'update').mockResolvedValue(updateResult);

      const result = await controller.update('1', updateCityDto);

      expect(result).toEqual(updateResult);
      expect(cityService.update).toHaveBeenCalledWith(1, updateCityDto);
    });
  });

  describe('remove', () => {
    it('should remove a city', async () => {
      const deleteResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      jest.spyOn(cityService, 'remove').mockResolvedValue(deleteResult);

      const result = await controller.remove('1');

      expect(result).toEqual(deleteResult);
      expect(cityService.remove).toHaveBeenCalledWith(1);
    });
  });
});
