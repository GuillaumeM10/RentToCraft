import { type ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { type Reflector } from '@nestjs/core';
import { type JwtService } from '@nestjs/jwt';
import { UserRole } from '@rent-to-craft/dtos';

import { type ValidTokenService } from '../../valid-token/valid-token.service';
import { AuthGuard } from './jwt-passport.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let reflector: Reflector;
  let jwtService: JwtService;
  let validTokenService: ValidTokenService;
  let context: ExecutionContext;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    jwtService = { verifyAsync: jest.fn() } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    validTokenService = { findOne: jest.fn() } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    guard = new AuthGuard(jwtService, reflector, validTokenService);
    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ headers: {} })
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  });

  it('should allow if route is public', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(true);
    expect(await guard.canActivate(context)).toBe(true);
  });

  it('should throw if no token', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw if token is not valid', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);
    (context.switchToHttp().getRequest as jest.Mock).mockReturnValue({ headers: { authorization: 'Bearer token' } });
    (validTokenService.findOne as jest.Mock).mockResolvedValue(false);
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should allow admin user', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);
    (context.switchToHttp().getRequest as jest.Mock).mockReturnValue({ headers: { authorization: 'Bearer token' } });
    (validTokenService.findOne as jest.Mock).mockResolvedValue(true);
    (jwtService.verifyAsync as jest.Mock).mockResolvedValue({ role: UserRole.administrator });
    expect(await guard.canActivate(context)).toBe(true);
  });

  it('should throw if jwtService throws', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);
    (context.switchToHttp().getRequest as jest.Mock).mockReturnValue({ headers: { authorization: 'Bearer token' } });
    (validTokenService.findOne as jest.Mock).mockResolvedValue(true);
    (jwtService.verifyAsync as jest.Mock).mockRejectedValue(new Error('Invalid token'));
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });
});
