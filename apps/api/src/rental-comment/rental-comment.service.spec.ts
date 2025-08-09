import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { RentalService } from '../rental/rental.service';
import { RentalCommentEntity } from './entities/rental-comment.entity';
import { RentalCommentService } from './rental-comment.service';

describe('RentalCommentService', () => {
  let service: RentalCommentService;

  const mockRepository = {
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
      getMany: jest.fn().mockReturnValue([]),
      getOne: jest.fn(),
    })),
  };

  const mockRentalService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalCommentService,
        {
          provide: getRepositoryToken(RentalCommentEntity),
          useValue: mockRepository,
        },
        {
          provide: RentalService,
          useValue: mockRentalService,
        },
      ],
    }).compile();

    service = module.get<RentalCommentService>(RentalCommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
