import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Une erreur interne est survenue';

    if (exception instanceof QueryFailedError) {
      const error = exception as QueryFailedError & {
        code?: string;
        column?: string;
      };

      switch (error.code) {
        case '23502': {
          status = HttpStatus.BAD_REQUEST;
          message = `Le champ ${error.column} est obligatoire`;
          break;
        }

        case '23503': {
          status = HttpStatus.BAD_REQUEST;
          message = 'Référence invalide';
          break;
        }

        case '23505': {
          status = HttpStatus.CONFLICT;
          message = 'Cette ressource existe déjà';
          break;
        }

        default: {
          status = HttpStatus.BAD_REQUEST;
          message = 'Erreur de base de données';
        }
      }
    } else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'Ressource non trouvée';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      ...(process.env.NODE_ENV !== 'production' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    };

    response.status(status).json(errorResponse);
  }
}
