import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { RentalService } from '../rental/rental.service';
import { UserService } from '../user/user.service';
import { FileEntity } from './entities/file.entity';
import { FileService } from './file.service';

describe('FileService', () => {
  let service: FileService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
  };

  const mockRentalService = {
    getAllFilesIds: jest.fn().mockResolvedValue([]),
  };

  const mockUserService = {
    getAllFilesIds: jest.fn().mockResolvedValue([]),
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
          provide: RentalService,
          useValue: mockRentalService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
