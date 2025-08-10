import { ClassSerializerInterceptor, type INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { CleanNullInterceptor } from './common/interceptors/clean-null.interceptor';
import { DateTransformInterceptor } from './common/interceptors/date-transform.interceptor';
import { registerGlobals } from './main';

describe('main.ts', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const mockApp = {
      useGlobalInterceptors: jest.fn(),
      get: jest.fn().mockReturnValue(new Reflector()),
    };

    app = mockApp as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  });

  describe('registerGlobals', () => {
    it('should register global interceptors', () => {
      registerGlobals(app);

      expect(app.useGlobalInterceptors).toHaveBeenCalledWith(
        expect.any(ClassSerializerInterceptor),
        expect.any(CleanNullInterceptor),
        expect.any(DateTransformInterceptor),
      );
    });

    it('should configure ClassSerializerInterceptor with correct options', () => {
      registerGlobals(app);

      const calls = (app.useGlobalInterceptors as jest.Mock).mock.calls[0];
      const classSerializerInterceptor = calls[0];

      expect(classSerializerInterceptor).toBeInstanceOf(ClassSerializerInterceptor);
    });
  });
});
