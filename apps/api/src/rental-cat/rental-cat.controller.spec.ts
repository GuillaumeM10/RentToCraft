import { Test, type TestingModule } from '@nestjs/testing';

import { RentalCatController } from './rental-cat.controller';
import { RentalCatService } from './rental-cat.service';

describe('RentalCatController', () => {
  let controller: RentalCatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalCatController],
      providers: [RentalCatService],
    }).compile();

    controller = module.get<RentalCatController>(RentalCatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
