import { UnauthorizedException } from '@nestjs/common';
import { type ConfigService } from '@nestjs/config';
import { type PayloadDto, UserRole } from '@rent-to-craft/dtos';

import { type UserService } from '../../user/user.service';
import { type ValidTokenService } from '../../valid-token/valid-token.service';
import { JwtStrategy } from './passport-jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;
  let userService: UserService;
  let validTokenService: ValidTokenService;

  beforeEach(() => {
    configService = { get: jest.fn().mockReturnValue('secret') } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    userService = { findOneByEmail: jest.fn() } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    validTokenService = { findOne: jest.fn() } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    strategy = new JwtStrategy(configService, userService, validTokenService);
  });

  it('should throw if email is missing', async () => {
    const payload = { firstName: 'Test', lastName: 'User', id: 1, role: UserRole.user } as PayloadDto;
    await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw if user not found', async () => {
    const payload = { email: 'test@test.com', firstName: 'Test', lastName: 'User', id: 1, role: UserRole.user };
    (userService.findOneByEmail as jest.Mock).mockResolvedValue(undefined);
    await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
  });

  it('should return user if admin', async () => {
    const payload = { email: 'admin@test.com', firstName: 'Admin', lastName: 'User', id: 1, role: UserRole.administrator };
    const user = { role: UserRole.administrator };
    (userService.findOneByEmail as jest.Mock).mockResolvedValue(user);
    expect(await strategy.validate(payload)).toBe(user);
  });

  it('should throw if token is not valid for non-admin', async () => {
    const payload = { email: 'user@test.com', firstName: 'Test', lastName: 'User', id: 1, role: UserRole.user };
    const user = { role: UserRole.user };
    (userService.findOneByEmail as jest.Mock).mockResolvedValue(user);
    (validTokenService.findOne as jest.Mock).mockResolvedValue(false);
    await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
  });

  it('should return user if token is valid for non-admin', async () => {
    const payload = { email: 'user@test.com', firstName: 'Test', lastName: 'User', id: 1, role: UserRole.user };
    const user = { role: UserRole.user };
    (userService.findOneByEmail as jest.Mock).mockResolvedValue(user);
    (validTokenService.findOne as jest.Mock).mockResolvedValue(true);
    expect(await strategy.validate(payload)).toBe(user);
  });
});
