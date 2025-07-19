import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MessageDto,
  SignupAuthDto,
  UserDto,
  UserUpdateDto,
} from '@rent-to-craft/dtos';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';

const salt = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUser: SignupAuthDto) {
    const user = createUser;

    if (!user.password) {
      throw new HttpException(
        `Toutes les informations ne sont pas renseignées.`,
        400,
      );
    }

    if (
      user.email === '' ||
      user.email === null ||
      user.email === undefined ||
      !user.email
    ) {
      throw new HttpException(`Email obligatoire.`, 400);
    }

    user.password = bcrypt.hashSync(user.password, salt);
    try {
      const newUser = await this.userRepository.save(user);

      return plainToInstance(UserDto, await this.findOneByEmail(newUser.email));
    } catch {
      throw new ConflictException('Cette adresse email est déjà utilisée');
    }
  }

  async findAll(queries) {
    const {
      page,
      limit,
      // search
    } = queries;

    const query = this.userRepository.createQueryBuilder('user');

    if (page && limit) {
      query.skip(page * limit).take(limit);
    }

    const users = await query.orderBy('user.id', 'DESC').getMany();

    if (users === null || users.length === 0) {
      throw new NotFoundException(`Pas de résultats`);
    }
    return users.map((user) => plainToInstance(UserDto, user));
  }

  async findOne(id: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
    if (user === null) {
      throw new NotFoundException(
        `Impossible de trouver l'utilisateur #${id}.`,
      );
    }

    return plainToInstance(UserDto, user);
  }

  async findOneByEmail(email: string, password?: boolean) {
    const query = this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email });

    if (password) {
      query.addSelect('user.password');
    }

    const user = query.getOne();

    if (user === null) {
      throw new NotFoundException(
        `Impossible de trouver l'utilisateur ${email}.`,
      );
    }

    return plainToInstance(UserDto, user);
  }

  async update(updateUserDto: UserUpdateDto, user: UserDto, id: number) {
    if (user.id !== id) {
      throw new HttpException('Unauthorized', 401);
    }

    const getUser = await this.findOne(user.id);

    if (getUser) {
      if (getUser.id !== user.id) {
        throw new NotFoundException(
          `Impossible de trouver l'utilisateur #${user.id}.`,
        );
      }

      const userUpdate = { ...getUser, ...updateUserDto };

      if (userUpdate.password) {
        userUpdate.password = bcrypt.hashSync(userUpdate.password, salt);
      }

      await this.userRepository.save(userUpdate);

      return plainToInstance(UserDto, userUpdate);
    } else {
      throw new NotFoundException(
        `Impossible de trouver l'utilisateur #${user.id}.`,
      );
    }
  }

  async updatePassword(password: string, updateUserDto: UserDto) {
    const user = await this.findOneByEmail(updateUserDto.email);

    if (!user) {
      throw new NotFoundException(
        `Impossible de trouver l'utilisateur ${updateUserDto.email}.`,
      );
    }

    const userUpdate = { ...user, ...updateUserDto };
    userUpdate.password = bcrypt.hashSync(password, salt);

    await this.userRepository.save(userUpdate);

    return plainToInstance(UserDto, userUpdate);
  }

  async softDelete(id: number, user) {
    const getUser = await this.findOne(id);

    if (getUser.id === user.id) {
      throw new NotFoundException(`Impossible de supprimer votre compte.`);
    } else {
      const userToRemove = await this.userRepository.softDelete(id);

      if (!userToRemove) {
        throw new NotFoundException(
          `Impossible de trouver l'utilisateur #${id}.`,
        );
      }

      return plainToInstance(MessageDto, {
        message: `L'utilisateur #${id} a été supprimé.`,
      });
    }
  }
}
