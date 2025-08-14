import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateValidTokenDto } from '@rent-to-craft/dtos';
import { Repository } from 'typeorm';

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
        throw new Error("L'identifiant utilisateur est requis");
      }
      if (!validToken.token) {
        throw new Error('Le token est requis');
      }

      const allreadyValidToken = await this.findOne(validToken.token);

      if (allreadyValidToken) {
        throw new Error('Ce token existe déjà');
      }

      const newValidToken = await this.validTokenRepository.save(validToken);
      return newValidToken;
    } catch {
      throw new Error('Erreur lors de la création du token valide');
    }
  }

  async findAllByUser(userId: number) {
    try {
      if (!userId) {
        throw new Error("L'identifiant utilisateur est requis");
      }
      const validTokens = await this.validTokenRepository
        .createQueryBuilder('validToken')
        .where('validToken.user = :userId', { userId })
        .getMany();

      return validTokens;
    } catch {
      throw new Error('Erreur lors de la récupération des tokens valides');
    }
  }

  async findOne(token: string) {
    try {
      if (!token) {
        throw new Error('Le token est requis');
      }
      const validToken = await this.validTokenRepository
        .createQueryBuilder('validToken')
        .where('validToken.token = :token', { token })
        .getOne();
      return validToken;
    } catch (error) {
      console.log(error);
      throw new Error('Erreur lors de la récupération du token valide');
    }
  }

  async remove(token: string, userId: number) {
    try {
      if (!token) {
        throw new Error('Le token est requis');
      }
      if (!userId) {
        throw new Error("L'identifiant utilisateur est requis");
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
      throw new Error('Erreur lors de la suppression du token valide');
    }
  }
}
