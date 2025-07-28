import { Test, type TestingModule } from '@nestjs/testing';

import { RentalCommentController } from './rental-comment.controller';
import { RentalCommentService } from './rental-comment.service';

describe('RentalCommentController', () => {
  let controller: RentalCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalCommentController],
      providers: [RentalCommentService],
    }).compile();

    controller = module.get<RentalCommentController>(RentalCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
