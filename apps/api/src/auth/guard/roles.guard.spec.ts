import { type ExecutionContext, ForbiddenException } from '@nestjs/common';
import { type Reflector } from '@nestjs/core';

import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;
  let context: ExecutionContext;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    guard = new RolesGuard(reflector);
    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user: undefined })
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  });

  it('should allow if no roles are required', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw if user is missing', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should throw if user does not have required role', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);
    (context.switchToHttp().getRequest as jest.Mock).mockReturnValue({ user: { role: 'user' } });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should allow if user has required role', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);
    (context.switchToHttp().getRequest as jest.Mock).mockReturnValue({ user: { role: 'admin' } });
    expect(guard.canActivate(context)).toBe(true);
  });
});
