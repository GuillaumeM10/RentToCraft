import { Logger } from '@nestjs/common';

import { LoggerMiddleware } from './logger.middleware';

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;
  let req: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  let res: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  let next: jest.Mock;

  beforeEach(() => {
    middleware = new LoggerMiddleware();
    req = { method: 'GET', originalUrl: '/test' };
    res = {
      statusCode: 200,
      write: jest.fn(),
      end: jest.fn(),
    };
    next = jest.fn();
    jest.spyOn(Logger, 'log').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call Logger.log on res.write', () => {
    middleware.use(req, res, next);
    res.write('data');
    expect(Logger.log).toHaveBeenCalledWith(expect.stringContaining('Request'));
    expect(next).toHaveBeenCalled();
  });

  it('should call Logger.log on res.end', () => {
    middleware.use(req, res, next);
    res.end();
    expect(Logger.log).toHaveBeenCalledWith(expect.stringContaining('Request'));
    expect(next).toHaveBeenCalled();
  });
});
