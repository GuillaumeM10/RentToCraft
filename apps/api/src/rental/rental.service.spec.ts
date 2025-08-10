import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { FileService } from '../file/file.service';
import { RentalCatService } from '../rental-cat/rental-cat.service';
import { RentalEntity } from './entities/rental.entity';
import { RentalService } from './rental.service';

describe('RentalService', () => {
  let service: RentalService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockReturnValue([]),
      getOne: jest.fn(),
    })),
  };

  const mockFileService = {
    create: jest.fn(),
    uploadFiles: jest.fn(),
  };

  const mockRentalCatService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalService,
        {
          provide: getRepositoryToken(RentalEntity),
          useValue: mockRepository,
        },
        {
          provide: FileService,
          useValue: mockFileService,
        },
        {
          provide: RentalCatService,
          useValue: mockRentalCatService,
        },
      ],
    }).compile();

    service = module.get<RentalService>(RentalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
