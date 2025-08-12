import { NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { type CityDto } from '@rent-to-craft/dtos';

import { CityService } from './city.service';
import { CityEntity } from './entities/city.entity';

describe('CityService', () => {
  let service: CityService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cityRepository: any;

  const mockCity: CityDto = {
    id: 1,
    name: 'Paris',
    slug: 'paris-75000',
    latitude: 48.8566,
    longitude: 2.3522,
  };

  const mockCityWithUsers = {
    id: 1,
    name: 'Paris',
    slug: 'paris-75000',
    latitude: 48.8566,
    longitude: 2.3522,
    users: [
      {
        id: 1,
        email: 'test@example.com',
        rentals: [
          {
            id: 1,
            slug: 'rental-1',
            name: 'Test Rental',
          },
          {
            id: 2,
            slug: 'rental-2',
            name: 'Test Rental 2',
          },
        ],
      },
    ],
  };

  const mockRepository = {
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    upsert: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
      getMany: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityService,
        {
          provide: getRepositoryToken(CityEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CityService>(CityService);
    cityRepository = module.get(getRepositoryToken(CityEntity));

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a city successfully', async () => {
      const createCityDto: Partial<CityDto> = {
        name: 'Paris',
        slug: 'paris-75000',
        latitude: 48.8566,
        longitude: 2.3522,
      };

      jest.spyOn(cityRepository, 'save').mockResolvedValue(mockCity);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await service.create(createCityDto as any);

      expect(cityRepository.save).toHaveBeenCalledWith(createCityDto);
      expect(result).toEqual(mockCity);
    });
  });

  describe('findAll', () => {
    it('should return all cities', async () => {
      const mockCities = [mockCity];
      jest.spyOn(cityRepository, 'find').mockResolvedValue(mockCities);

      const result = await service.findAll();

      expect(cityRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockCities);
    });

    it('should return empty array when no cities exist', async () => {
      jest.spyOn(cityRepository, 'find').mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return city with rentals when city exists', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockCityWithUsers),
      };
      jest
        .spyOn(cityRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);

      const result = await service.findOne(1);

      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'city.users',
        'user',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'user.rentals',
        'rental',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'rental.images',
        'images',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'rental.cats',
        'cats',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'rental.comments',
        'comments',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'rental.user',
        'owner',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'owner.profilePicture',
        'ownerProfilePicture',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('city.id = :cityId', {
        cityId: 1,
      });
      expect(result).toEqual({
        city: mockCityWithUsers,
        rentals: ['rental-1', 'rental-2'],
      });
    });

    it('should return city with empty rentals when no users have rentals', async () => {
      const mockCityWithoutRentals = {
        ...mockCityWithUsers,
        users: [
          {
            id: 1,
            email: 'test@example.com',
            rentals: [],
          },
        ],
      };

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockCityWithoutRentals),
      };
      jest
        .spyOn(cityRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);

      const result = await service.findOne(1);

      expect(result).toEqual({
        city: mockCityWithoutRentals,
        rentals: [],
      });
    });

    it('should return city with empty rentals when no users exist', async () => {
      const mockCityWithoutUsers = {
        ...mockCityWithUsers,
        users: [],
      };

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockCityWithoutUsers),
      };
      jest
        .spyOn(cityRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);

      const result = await service.findOne(1);

      expect(result).toEqual({
        city: mockCityWithoutUsers,
        rentals: [],
      });
    });

    it('should throw NotFoundException when city does not exist', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      jest
        .spyOn(cityRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('search', () => {
    it('should return cities matching the query', async () => {
      const mockCities = [mockCity];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockCities),
      };
      jest
        .spyOn(cityRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);

      const result = await service.search('Paris');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'city.name ILIKE :query',
        { query: '%Paris%' },
      );
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(20);
      expect(result).toEqual(mockCities);
    });

    it('should return empty array when no cities match the query', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      jest
        .spyOn(cityRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);

      const result = await service.search('NonExistentCity');

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update city successfully', async () => {
      const updateCityDto: Partial<CityDto> = {
        name: 'Updated Paris',
        slug: 'updated-paris-75000',
        latitude: 48.8566,
        longitude: 2.3522,
      };

      const mockUpdateResult = { affected: 1 };
      jest.spyOn(cityRepository, 'update').mockResolvedValue(mockUpdateResult);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await service.update(1, updateCityDto as any);

      expect(cityRepository.update).toHaveBeenCalledWith(1, updateCityDto);
      expect(result).toEqual(mockUpdateResult);
    });
  });

  describe('remove', () => {
    it('should remove city successfully', async () => {
      const mockDeleteResult = { affected: 1 };
      jest.spyOn(cityRepository, 'delete').mockResolvedValue(mockDeleteResult);

      const result = await service.remove(1);

      expect(cityRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockDeleteResult);
    });
  });

  describe('initData', () => {
    beforeEach(() => {
      // Mock fetch globally
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return early when cities already exist in database', async () => {
      const mockCities = [mockCity];
      jest.spyOn(cityRepository, 'find').mockResolvedValue(mockCities);
      jest.spyOn(console, 'log').mockImplementation(() => {});

      const result = await service.initData();

      expect(cityRepository.find).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should import cities from API when database is empty', async () => {
      jest.spyOn(cityRepository, 'find').mockResolvedValue([]);
      jest.spyOn(cityRepository, 'upsert').mockResolvedValue(undefined);

      const mockApiResponse = [
        {
          code: '75000',
          nom: 'Paris',
          centre: {
            coordinates: [2.3522, 48.8566],
            type: 'Point',
          },
        },
        {
          code: '69000',
          nom: 'Lyon',
          centre: {
            coordinates: [4.8357, 45.764],
            type: 'Point',
          },
        },
        {
          code: '13000',
          nom: 'Marseille',
          centre: null, // This should be filtered out
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      const result = await service.initData();

      expect(global.fetch).toHaveBeenCalledWith(
        'https://geo.api.gouv.fr/communes?fields=nom,code,centre&format=json&geometry=centre',
      );
      expect(cityRepository.upsert).toHaveBeenCalledWith(
        [
          {
            name: 'Paris',
            slug: 'paris-75000',
            latitude: 48.8566,
            longitude: 2.3522,
          },
          {
            name: 'Lyon',
            slug: 'lyon-69000',
            latitude: 45.764,
            longitude: 4.8357,
          },
        ],
        ['slug'],
      );
      expect(result).toEqual({ imported: 2 });
    });

    it('should handle API error', async () => {
      jest.spyOn(cityRepository, 'find').mockResolvedValue([]);

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(service.initData()).rejects.toThrow(
        'Échec de récupération des communes: 500',
      );
    });

    it('should handle cities with invalid centre data', async () => {
      jest.spyOn(cityRepository, 'find').mockResolvedValue([]);
      jest.spyOn(cityRepository, 'upsert').mockResolvedValue(undefined);

      const mockApiResponse = [
        {
          code: '75000',
          nom: 'Paris',
          centre: {
            coordinates: [2.3522, 48.8566],
            type: 'Point',
          },
        },
        {
          code: '13000',
          nom: 'Marseille',
          centre: {
            coordinates: 'invalid', // This should be filtered out
            type: 'Point',
          },
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      const result = await service.initData();

      expect(cityRepository.upsert).toHaveBeenCalledWith(
        [
          {
            name: 'Paris',
            slug: 'paris-75000',
            latitude: 48.8566,
            longitude: 2.3522,
          },
        ],
        ['slug'],
      );
      expect(result).toEqual({ imported: 1 });
    });

    it('should handle large datasets by chunking', async () => {
      jest.spyOn(cityRepository, 'find').mockResolvedValue([]);
      jest.spyOn(cityRepository, 'upsert').mockResolvedValue(undefined);

      // Create 2500 mock cities (more than chunk size of 1000)
      const mockApiResponse = Array.from({ length: 2500 }, (_, i) => ({
        code: `${10_000 + i}`,
        nom: `City${i}`,
        centre: {
          coordinates: [2.3522 + i * 0.001, 48.8566 + i * 0.001],
          type: 'Point',
        },
      }));

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      const result = await service.initData();

      // Should be called 3 times (1000 + 1000 + 500)
      expect(cityRepository.upsert).toHaveBeenCalledTimes(3);
      expect(result).toEqual({ imported: 2500 });
    });
  });
});
