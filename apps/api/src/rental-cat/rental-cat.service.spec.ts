import { Test, type TestingModule } from '@nestjs/testing';

import { RentalCatService } from './rental-cat.service';

describe('RentalCatService', () => {
  let service: RentalCatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RentalCatService],
    }).compile();

    service = module.get<RentalCatService>(RentalCatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
