import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MessageDto,
  SignupAuthDto,
  UserDto,
  UserUpdateDto,
} from '@rent-to-craft/dtos';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { FileService } from 'src/file/file.service';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';

const salt = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly fileService: FileService,
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
    const newUser = await this.userRepository.save(user);

    return plainToInstance(UserDto, newUser);
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

    const users = await query
      .orderBy('user.id', 'DESC')
      .leftJoinAndSelect('user.profilePicture', 'profilePicture')
      .getMany();

    if (users === null || users.length === 0) {
      throw new NotFoundException(`Pas de résultats`);
    }
    return users.map((user) => plainToInstance(UserDto, user));
  }

  async findOne(id: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoinAndSelect('user.profilePicture', 'profilePicture')
      .leftJoinAndSelect('user.banner', 'banner')
      .getOne();
    if (user === null) {
      throw new NotFoundException(
        `Impossible de trouver l'utilisateur #${id}.`,
      );
    }

    return plainToInstance(UserDto, user);
  }

  async findOneByEmail(email: string) {
    const query = this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email });

    const user = query.getOne();

    if (user === null) {
      throw new NotFoundException(
        `Impossible de trouver l'utilisateur ${email}.`,
      );
    }

    return plainToInstance(UserDto, user);
  }

  async update(updateUserDto: UserUpdateDto, user: UserDto, id: number, files) {
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

      const handleFile = async (fileArr) => {
        if (fileArr && fileArr.length > 0) {
          const optimizedFile = await this.fileService.optimizeFile(fileArr[0]);
          return this.fileService.create({
            name: fileArr[0].originalname as string,
            file: optimizedFile,
            id: null,
          });
        }
        return null;
      };

      if (files?.profilePicture) {
        updateUserDto.profilePicture = await handleFile(files.profilePicture);
      } else if (
        files?.profilePicture === '' ||
        files?.profilePicture === undefined
      ) {
        updateUserDto.profilePicture = null;
      }
      if (files?.banner) {
        updateUserDto.banner = await handleFile(files.banner);
      } else if (files?.banner === '' || files?.banner === undefined) {
        updateUserDto.banner = null;
      }

      if (files === undefined) {
        updateUserDto.profilePicture = getUser.profilePicture;
        updateUserDto.banner = getUser.banner;
      }

      const userUpdate = {
        ...getUser,
        ...updateUserDto,
      };

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

  async getUserPassword(email: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.password'])
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new NotFoundException(
        `Impossible de trouver l'utilisateur ${email}.`,
      );
    }

    return user.password;
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

  async softDelete(id: number, user: UserDto) {
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

  async getAllFilesIds() {
    const users = await this.userRepository.find({
      select: ['profilePicture', 'banner'],
      relations: ['profilePicture', 'banner'],
    });

    const filesIds = users.reduce((acc, user) => {
      if (user.profilePicture) {
        acc.push(user.profilePicture.id);
      }
      if (user.banner) {
        acc.push(user.banner.id);
      }
      return acc;
    }, []);

    return filesIds;
  }
}
