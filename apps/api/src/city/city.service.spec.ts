import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { type Repository } from 'typeorm';

import { CityService } from './city.service';
import { CityEntity } from './entities/city.entity';

describe('CityService', () => {
  let service: CityService;
  let repository: Repository<CityEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityService,
        {
          provide: getRepositoryToken(CityEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            createQueryBuilder: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            upsert: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CityService>(CityService);
    repository = module.get<Repository<CityEntity>>(
      getRepositoryToken(CityEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have repository injected', () => {
    expect(repository).toBeDefined();
  });
});
