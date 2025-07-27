import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { PayloadDto, UserRole } from '@rent-to-craft/dtos';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from '../../user/user.service';
import { ValidTokenService } from '../../valid-token/valid-token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private validTokenService: ValidTokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: PayloadDto) {
    const { email } = payload;

    if (!email) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.role === UserRole.administrator) {
      return user;
    }

    const token = ExtractJwt.fromAuthHeaderAsBearerToken();
    const isJwtValid = await this.validTokenService.findOne(token);

    if (!isJwtValid) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
