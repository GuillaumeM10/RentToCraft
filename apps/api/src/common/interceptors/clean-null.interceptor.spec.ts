import { type CallHandler, type ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';

import { CleanNullInterceptor } from './clean-null.interceptor';

describe('CleanNullInterceptor', () => {
  let interceptor: CleanNullInterceptor;
  let context: ExecutionContext;
  let callHandler: CallHandler;

  beforeEach(() => {
    interceptor = new CleanNullInterceptor();
    context = {} as ExecutionContext;
    callHandler = { handle: jest.fn() } as jest.Mocked<CallHandler>;
  });

  it('should remove null values from object', (done) => {
    (callHandler.handle as jest.Mock).mockReturnValue(of({ a: 1, b: null, c: 2 }));
    interceptor.intercept(context, callHandler).subscribe(result => {
      expect(result).toEqual({ a: 1, c: 2 });
      done();
    });
  });

  it('should remove null values from array', (done) => {
    (callHandler.handle as jest.Mock).mockReturnValue(of([{ a: 1 }, null, { b: 2 }]));
    interceptor.intercept(context, callHandler).subscribe(result => {
      expect(result).toEqual([{ a: 1 }, { b: 2 }]);
      done();
    });
  });

  it('should keep non-null values', (done) => {
    (callHandler.handle as jest.Mock).mockReturnValue(of({ a: 1, b: 2 }));
    interceptor.intercept(context, callHandler).subscribe(result => {
      expect(result).toEqual({ a: 1, b: 2 });
      done();
    });
  });
});
