import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateTokenResetPasswordDto,
  MessageDto,
  ValidtokenDto,
} from '@rent-to-craft/dtos';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { UserService } from '../user/user.service';
import { TokenResetPasswordEntity } from './entities/token-reset-password.entity';

@Injectable()
export class TokenResetPasswordService {
  constructor(
    @InjectRepository(TokenResetPasswordEntity)
    private readonly tokenResetPasswordRepository: Repository<TokenResetPasswordEntity>,
    private usersService: UserService,
  ) {}

  async create(createTokenResetPasswordDto: CreateTokenResetPasswordDto) {
    const findUser = await this.usersService.findOneByEmail(
      createTokenResetPasswordDto.email,
    );

    if (!findUser) {
      throw new HttpException("Cet utilisateur n'existe pas.", 404);
    }

    const findToken = await this.findOneByEmail(
      createTokenResetPasswordDto.email,
    );

    if (findToken) {
      return plainToInstance(ValidtokenDto, findToken);
    }

    const token = uuidv4();

    const newToken = this.tokenResetPasswordRepository.create({
      token,
      user: findUser,
    });
    return plainToInstance(
      ValidtokenDto,
      this.tokenResetPasswordRepository.save(newToken),
    );
  }

  async findOneByEmail(email: string) {
    const findUser = await this.usersService.findOneByEmail(email);

    if (!findUser) {
      throw new HttpException("Cet utilisateur n'existe pas.", 404);
    }

    const token = await this.tokenResetPasswordRepository
      .createQueryBuilder('resetPasswordToken')
      .leftJoinAndSelect('resetPasswordToken.user', 'user')
      .where('user.email = :email', { email })
      .getOne();

    return plainToInstance(ValidtokenDto, token);
  }

  async findOne(token: string) {
    const findToken = await this.tokenResetPasswordRepository
      .createQueryBuilder('resetPasswordToken')
      .leftJoinAndSelect('resetPasswordToken.user', 'user')
      .where('resetPasswordToken.token = :token', { token })
      .getOne();
    return plainToInstance(ValidtokenDto, findToken);
  }

  async remove(id: number) {
    try {
      await this.tokenResetPasswordRepository.delete(id);
      return plainToInstance(MessageDto, {
        message: 'Token supprimé',
      });
    } catch (error) {
      console.log(error);

      throw new HttpException('Erreur lors de la suppresion du token', 400);
    }
  }

  async clearUserTokens(userId: number) {
    await this.tokenResetPasswordRepository.delete({ user: { id: userId } });
    return plainToInstance(MessageDto, {
      message: `L'utilisateur ${userId} n'a plus de token pour les mot de passe oublié`,
    });
  }
}
