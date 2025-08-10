import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { RentalCatEntity } from './entities/rental-cat.entity';
import { RentalCatService } from './rental-cat.service';

describe('RentalCatService', () => {
  let service: RentalCatService;

  const mockRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    softDelete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockReturnValue([]),
      getOne: jest.fn(),
    })),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalCatService,
        {
          provide: getRepositoryToken(RentalCatEntity),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RentalCatService>(RentalCatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
