import { Test, type TestingModule } from '@nestjs/testing';

import { RentalCommentService } from './rental-comment.service';

describe('RentalCommentService', () => {
  let service: RentalCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RentalCommentService],
    }).compile();

    service = module.get<RentalCommentService>(RentalCommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
