import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';

import { AuthGuard } from '../auth/guard/jwt-passport.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { ValidTokenService } from '../valid-token/valid-token.service';
import { RentalCatController } from './rental-cat.controller';
import { RentalCatService } from './rental-cat.service';

describe('RentalCatController', () => {
  let controller: RentalCatController;
  let service: RentalCatService;

  const mockRentalCatService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findBySlug: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    initData: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockValidTokenService = {
    findByToken: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalCatController],
      providers: [
        {
          provide: RentalCatService,
          useValue: mockRentalCatService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ValidTokenService,
          useValue: mockValidTokenService,
        },
        Reflector,
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<RentalCatController>(RentalCatController);
    service = module.get<RentalCatService>(RentalCatService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have service', () => {
    expect(service).toBeDefined();
  });
});
