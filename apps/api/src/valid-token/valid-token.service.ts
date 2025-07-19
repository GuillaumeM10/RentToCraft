import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateValidTokenDto } from './dtos';
import { ValidTokenEntity } from './entities/valid-token.entity';

@Injectable()
export class ValidTokenService {
  constructor(
    @InjectRepository(ValidTokenEntity)
    private readonly validTokenRepository: Repository<ValidTokenEntity>,
  ) {}

  async create(createValidTokenDto: CreateValidTokenDto) {
    try {
      const validToken = createValidTokenDto;

      if (!validToken.user) {
        throw new Error('userId is required');
      }
      if (!validToken.token) {
        throw new Error('token is required');
      }

      const allreadyValidToken = await this.findOne(validToken.token);

      if (allreadyValidToken) {
        throw new Error('token already exist');
      }

      const newValidToken = await this.validTokenRepository.save(validToken);
      return newValidToken;
    } catch {
      throw new Error('Error while creating validToken');
    }
  }

  async findAllByUser(userId: number) {
    try {
      if (!userId) {
        throw new Error('userId is required');
      }
      const validTokens = await this.validTokenRepository
        .createQueryBuilder('validToken')
        .where('validToken.user = :userId', { userId })
        .getMany();

      return validTokens;
    } catch {
      throw new Error('Error while fetching validToken');
    }
  }

  async findOne(token: string) {
    try {
      if (!token) {
        throw new Error('token is required');
      }
      const validToken = await this.validTokenRepository
        .createQueryBuilder('validToken')
        .where('validToken.token = :token', { token })
        .getOne();
      return validToken;
    } catch (error) {
      console.log(error);
      throw new Error('Error while fetching validToken');
    }
  }

  async remove(token: string, userId: number) {
    try {
      if (!token) {
        throw new Error('token is required');
      }
      if (!userId) {
        throw new Error('userId is required');
      }

      await this.validTokenRepository
        .createQueryBuilder('validToken')
        .delete()
        .from(ValidTokenEntity)
        .where('token = :token', { token })
        .andWhere('user = :userId', { userId })
        .execute();

      return {
        message: 'Token supprimé',
      };
    } catch {
      throw new Error('Error while removing validToken');
    }
  }
}
