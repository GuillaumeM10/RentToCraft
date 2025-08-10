import { type CallHandler, type ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';

import { DateTransformInterceptor } from './date-transform.interceptor';

describe('DateTransformInterceptor', () => {
  let interceptor: DateTransformInterceptor;
  let context: ExecutionContext;
  let callHandler: CallHandler;

  beforeEach(() => {
    interceptor = new DateTransformInterceptor();
    context = {} as ExecutionContext;
    callHandler = { handle: jest.fn() } as jest.Mocked<CallHandler>;
  });

  it('should transform Date to ISO string in object', (done) => {
    const now = new Date();
    (callHandler.handle as jest.Mock).mockReturnValue(of({ a: now, b: 2 }));
    interceptor.intercept(context, callHandler).subscribe(result => {
      expect(result).toEqual({ a: now.toISOString(), b: 2 });
      done();
    });
  });

  it('should transform Date to ISO string in array', (done) => {
    const now = new Date();
    (callHandler.handle as jest.Mock).mockReturnValue(of([{ a: now }, { b: 2 }]));
    interceptor.intercept(context, callHandler).subscribe(result => {
      expect(result).toEqual([{ a: now.toISOString() }, { b: 2 }]);
      done();
    });
  });

  it('should keep non-date values', (done) => {
    (callHandler.handle as jest.Mock).mockReturnValue(of({ a: 1, b: 2 }));
    interceptor.intercept(context, callHandler).subscribe(result => {
      expect(result).toEqual({ a: 1, b: 2 });
      done();
    });
  });
});
