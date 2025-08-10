import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';

import { MailService } from '../mail/mail.service';
import { TokenResetPasswordService } from '../token-reset-password/token-reset-password.service';
import { UserService } from '../user/user.service';
import { ValidTokenService } from '../valid-token/valid-token.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockUserService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    validatePassword: jest.fn(),
  };

  const mockTokenResetPasswordService = {
    create: jest.fn(),
    findByToken: jest.fn(),
    remove: jest.fn(),
  };

  const mockMailService = {
    sendMail: jest.fn(),
  };

  const mockValidTokenService = {
    create: jest.fn(),
    findByToken: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: TokenResetPasswordService,
          useValue: mockTokenResetPasswordService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
        {
          provide: ValidTokenService,
          useValue: mockValidTokenService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
