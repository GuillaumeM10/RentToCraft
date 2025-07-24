import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  CreateTokenResetPasswordDto,
  MessageDto,
  PayloadDto,
  ResetPasswordDto,
  SigninAuthDto,
  SignupAuthDto,
  TokenDto,
  UserDto,
} from '@rent-to-craft/dtos';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';

import { MailService } from '../mail/mail.service';
import { TokenResetPasswordService } from '../token-reset-password/token-reset-password.service';
import { UserService } from '../user/user.service';
import { ValidTokenService } from '../valid-token/valid-token.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private readonly jwtService: JwtService,
    private tokenResetPasswordService: TokenResetPasswordService,
    private mailService: MailService,
    private validTokenService: ValidTokenService,
  ) {}

  async signup(signupAuthDto: SignupAuthDto) {
    const user = await this.usersService.create(signupAuthDto);
    if (
      user.email !== '' &&
      user.email !== null &&
      user.email !== undefined &&
      user.email
    ) {
      await this.mailService.sendUserConfirmation(user);

      return plainToInstance(UserDto, user);
    } else {
      throw new HttpException('Email requis', 400);
    }
  }

  async signin(signinAuthDto: SigninAuthDto) {
    const user = await this.usersService.findOneByEmail(
      signinAuthDto.email,
      true,
    );

    const password = bcrypt.compareSync(signinAuthDto.password, user.password);

    if (!user || !password) {
      throw new UnauthorizedException();
    }

    const payload = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.id,
    };

    const token = this.generateJwtToken(payload);
    await this.validTokenService.create({ token, user: user });
    await this.tokenResetPasswordService.clearUserTokens(user.id);

    return plainToInstance(TokenDto, { accessToken: token });
  }

  generateJwtToken(payload: PayloadDto) {
    return this.jwtService.sign(payload);
  }

  async forgotPassword(
    createTokenResetPasswordDto: CreateTokenResetPasswordDto,
  ) {
    const token = await this.tokenResetPasswordService.create(
      createTokenResetPasswordDto,
    );

    await this.mailService.create(createTokenResetPasswordDto, token.token);

    return plainToInstance(MessageDto, {
      message: `Un email à été envoyé à ${createTokenResetPasswordDto.email}`,
    });
  }

  async resetPassword(token: string, resetPasswordDto: ResetPasswordDto) {
    const findToken = await this.tokenResetPasswordService.findOne(token);

    if (!findToken) {
      throw new HttpException("Le token n'existe pas", 404);
    }

    const user = await this.usersService.findOneByEmail(findToken.user.email);

    if (!user) {
      throw new HttpException("Cet utilisateur n'existe pas.", 404);
    }

    const updatedUser = await this.usersService.updatePassword(
      resetPasswordDto.password,
      user,
    );

    await this.tokenResetPasswordService.remove(findToken.id);

    const userValidTokens = await this.validTokenService.findAllByUser(
      updatedUser.id,
    );
    userValidTokens.forEach(async (validToken) => {
      await this.validTokenService.remove(validToken.token, updatedUser.id);
    });

    return plainToInstance(MessageDto, {
      message: 'Mot de passe modifié avec succès',
    });
  }

  async logout(token: string, userId: number) {
    token = token.replace('Bearer ', '');
    const validToken = await this.validTokenService.findOne(token);
    if (!validToken) {
      throw new HttpException("Le token n'existe pas", 404);
    }

    try {
      await this.validTokenService.remove(token, userId);
    } catch {
      throw new HttpException('Erreur lors de la suppresion du token', 400);
    }

    return plainToInstance(MessageDto, { message: 'Déconnexion réussit' });
  }
}
