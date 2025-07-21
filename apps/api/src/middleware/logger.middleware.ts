import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const yellow = '\u001B[33m';
    const reset = '\u001B[0m';

    const originalWrite = res.write;
    const originalEnd = res.end;

    let statusLogged = false;

    res.write = function (
      chunk: Buffer | string,
      encodingOrCallback?: BufferEncoding | ((error: Error | null) => void),
      callback?: (error: Error | null) => void,
    ): boolean {
      if (!statusLogged && res.statusCode) {
        Logger.log(
          `Request ${yellow}${req.method}${reset} - ${yellow}${res.statusCode}${reset} ${req.originalUrl} `,
        );
        statusLogged = true;
      }

      return typeof encodingOrCallback === 'function' ? originalWrite.call(this, chunk, encodingOrCallback) : originalWrite.call(this, chunk, encodingOrCallback, callback);
    };

    res.end = function (
      chunk?: Buffer | (() => void) | string,
      encodingOrCallback?: BufferEncoding | (() => void),
      callback?: () => void,
    ): Response {
      if (!statusLogged && res.statusCode) {
        Logger.log(
          `Request ${yellow}${req.method}${reset} - ${yellow}${res.statusCode}${reset} ${req.originalUrl} `,
        );
        statusLogged = true;
      }

      if (typeof chunk === 'function') {
        return originalEnd.call(this, chunk);
      } else if (typeof encodingOrCallback === 'function') {
        return originalEnd.call(this, chunk, encodingOrCallback);
      } else {
        return originalEnd.call(this, chunk, encodingOrCallback, callback);
      }
    };

    next();
  }
}
