import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';

import { AuthGuard } from '../auth/guard/jwt-passport.guard';
import { ValidTokenService } from '../valid-token/valid-token.service';
import { RentalCommentController } from './rental-comment.controller';
import { RentalCommentService } from './rental-comment.service';

describe('RentalCommentController', () => {
  let controller: RentalCommentController;

  const mockRentalCommentService = {
    create: jest.fn(),
    findByRental: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
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
      controllers: [RentalCommentController],
      providers: [
        {
          provide: RentalCommentService,
          useValue: mockRentalCommentService,
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
      .compile();

    controller = module.get<RentalCommentController>(RentalCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
