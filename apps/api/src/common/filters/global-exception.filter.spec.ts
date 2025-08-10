import { type ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

import { GlobalExceptionFilter } from './global-exception.filter';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let mockResponse: { json: jest.Mock; status: jest.Mock };
  let mockRequest: { url: string };
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    mockRequest = { url: '/test' };
    mockHost = {
      switchToHttp: () => ({ getResponse: () => mockResponse, getRequest: () => mockRequest })
    } as jest.Mocked<ArgumentsHost>;
  });

  it('should handle QueryFailedError 23502', () => {
    const exception = Object.create(QueryFailedError.prototype);
    Object.assign(exception, { code: '23502', column: 'name' });
    filter.catch(exception, mockHost); // eslint-disable-line promise/valid-params
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('obligatoire') }));
  });

  it('should handle QueryFailedError 23503', () => {
    const exception = Object.create(QueryFailedError.prototype);
    Object.assign(exception, { code: '23503' });
    filter.catch(exception, mockHost); // eslint-disable-line promise/valid-params
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('Référence invalide') }));
  });

  it('should handle QueryFailedError 23505', () => {
    const exception = Object.create(QueryFailedError.prototype);
    Object.assign(exception, { code: '23505' });
    filter.catch(exception, mockHost); // eslint-disable-line promise/valid-params
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('existe déjà') }));
  });

  it('should handle EntityNotFoundError', () => {
    const exception = new EntityNotFoundError('Entity', {});
    filter.catch(exception, mockHost); // eslint-disable-line promise/valid-params
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('Ressource non trouvée') }));
  });

  it('should handle HttpException', () => {
    const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    filter.catch(exception, mockHost); // eslint-disable-line promise/valid-params
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Forbidden' }));
  });

  it('should handle generic error', () => {
    const exception = new Error('Oops');
    filter.catch(exception, mockHost); // eslint-disable-line promise/valid-params
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('interne') }));
  });
});
