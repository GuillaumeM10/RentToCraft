import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';

import { MailModule } from './mail.module';
import { MailService } from './mail.service';

describe('MailModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [MailModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn((key: string) => {
          if (key === 'NODE_ENV') {
            return 'test';
          }
          return null;
        }),
      })
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide MailService', () => {
    const mailService = module.get<MailService>(MailService);
    expect(mailService).toBeDefined();
  });

  it('should export MailService', () => {
    const mailService = module.get<MailService>(MailService);
    expect(mailService).toBeInstanceOf(MailService);
  });
});
