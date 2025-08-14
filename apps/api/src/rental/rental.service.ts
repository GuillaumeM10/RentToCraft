import {
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto, RentalDto, UserDto } from '@rent-to-craft/dtos';
import { plainToInstance } from 'class-transformer';
import slugify from 'slugify';
import { FileService } from 'src/file/file.service';
import { RentalCatService } from 'src/rental-cat/rental-cat.service';
import { Repository } from 'typeorm';

import { RentalEntity } from './entities/rental.entity';

@Injectable()
export class RentalService {
  constructor(
    @InjectRepository(RentalEntity)
    private readonly rentalRepository: Repository<RentalEntity>,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    @Inject(forwardRef(() => RentalCatService))
    private readonly rentalCatService: RentalCatService,
  ) {}

  async create(
    createRentalDto: RentalDto,
    files: { images?: File[] },
    user: UserDto,
  ) {
    if (files?.images && files.images.length > 0) {
      const uploadedImages = await Promise.all(
        files.images.map((image) => this.fileService.create(image)),
      );
      createRentalDto.images = uploadedImages;
    }

    if (files?.images === undefined) {
      throw new HttpException('Aucune image fournie.', 400);
    }

    if (!createRentalDto.user) {
      createRentalDto.user = user;
    }

    if (createRentalDto.slug === undefined) {
      const uuid = Date.now().toString();
      createRentalDto.slug =
        slugify(createRentalDto.name, {
          lower: true,
          strict: true,
          locale: 'fr',
          replacement: '-',
        }) +
        '-' +
        uuid;
    }

    if (createRentalDto.cats && createRentalDto.cats.length > 0) {
      const cats = Array.isArray(createRentalDto.cats)
        ? createRentalDto.cats
        : (createRentalDto.cats as string).split(',').map((cat) => cat.trim());

      createRentalDto.cats = await Promise.all(
        cats.map((cat) =>
          this.rentalCatService.findOne(typeof cat === 'string' ? cat : cat.id),
        ),
      );
    }

    const newRental = await this.rentalRepository.save(createRentalDto);
    return plainToInstance(RentalDto, newRental);
  }

  async findAll(queries?) {
    const { page, limit, search, category, userId } = queries || {};

    const query = this.rentalRepository.createQueryBuilder('rental');

    if (search) {
      query.where(
        'rental.name ILIKE :search OR rental.description ILIKE :search',
        { search: `%${search}%` },
      );
    }

    if (category) {
      query.andWhere('cats.id = :categoryId', { categoryId: category });
    }

    if (userId) {
      query.andWhere('rental.user = :userId', { userId });
    }

    if (page && limit) {
      query.skip(page * limit).take(limit);
    }

    const rentals = await query
      .orderBy('rental.createdAt', 'DESC')
      .leftJoinAndSelect('rental.images', 'images')
      .leftJoinAndSelect('rental.user', 'user')
      .leftJoinAndSelect('rental.cats', 'cats')
      .getMany();

    if (rentals === null || rentals.length === 0) {
      throw new NotFoundException('Aucune location trouvée');
    }

    return rentals.map((rental) => plainToInstance(RentalDto, rental));
  }

  async findAllByUser(userId: number) {
    const rentals = await this.rentalRepository
      .createQueryBuilder('rental')
      .where('rental.user.id = :userId', { userId: userId })
      .leftJoinAndSelect('rental.images', 'images')
      .leftJoinAndSelect('rental.user', 'user')
      .leftJoinAndSelect('user.profilePicture', 'profilePicture')
      .leftJoinAndSelect('user.city', 'city')
      .leftJoinAndSelect('rental.cats', 'cats')
      .leftJoinAndSelect('rental.comments', 'comments')
      .orderBy('rental.createdAt', 'DESC')
      .getMany();

    if (rentals === null || rentals.length === 0) {
      throw new NotFoundException(
        `Aucune location trouvée pour l'utilisateur #${userId}.`,
      );
    }

    return rentals.map((rental) => plainToInstance(RentalDto, rental));
  }

  async findOne(id: number | string) {
    const query = this.rentalRepository
      .createQueryBuilder('rental')
      .leftJoinAndSelect('rental.images', 'images')
      .leftJoinAndSelect('rental.user', 'user')
      .leftJoinAndSelect('user.city', 'city')
      .leftJoinAndSelect('rental.cats', 'cats')
      .leftJoinAndSelect('rental.comments', 'comments')
      .leftJoinAndSelect('comments.author', 'commentAuthor');

    if (typeof id === 'number') {
      query.where('rental.id = :id', { id });
    }

    if (typeof id === 'string') {
      query.where('rental.slug = :slug', { slug: id });
    }

    const rental = await query.getOne();

    if (!rental) {
      throw new NotFoundException(`Impossible de trouver la location #${id}.`);
    }
    return plainToInstance(RentalDto, rental);
  }

  async findBySlug(slug: string) {
    const rental = await this.rentalRepository
      .createQueryBuilder('rental')
      .where('rental.slug = :slug', { slug })
      .leftJoinAndSelect('rental.images', 'images')
      .leftJoinAndSelect('rental.user', 'user')
      .leftJoinAndSelect('user.city', 'city')
      .leftJoinAndSelect('rental.cats', 'cats')
      .leftJoinAndSelect('rental.comments', 'comments')
      .leftJoinAndSelect('comments.author', 'commentAuthor')
      .getOne();

    if (!rental) {
      throw new NotFoundException(`Impossible de trouver la location ${slug}.`);
    }

    return plainToInstance(RentalDto, rental);
  }

  async update(id: number, updateRentalDto: RentalDto, user: UserDto) {
    const getRental = await this.findOne(id);

    if (!getRental) {
      throw new NotFoundException(`Impossible de trouver la location #${id}.`);
    }

    if (getRental.user.id !== user.id && user.role !== 'administrator') {
      throw new HttpException('Non autorisé', 401);
    }

    if (updateRentalDto.name && updateRentalDto.name !== getRental.name) {
      updateRentalDto.slug = slugify(updateRentalDto.name, {
        lower: true,
        strict: true,
        locale: 'fr',
      });
    }

    if (updateRentalDto.cats && updateRentalDto.cats.length > 0) {
      const cats = Array.isArray(updateRentalDto.cats)
        ? updateRentalDto.cats
        : (updateRentalDto.cats as string).split(',').map((cat) => cat.trim());

      updateRentalDto.cats = await Promise.all(
        cats.map((cat) =>
          this.rentalCatService.findOne(
            typeof cat === 'string' || typeof cat === 'number' ? cat : cat.id,
          ),
        ),
      );
    }

    const rentalUpdate = {
      ...getRental,
      ...updateRentalDto,
    };

    const updatedRental = await this.rentalRepository.save(rentalUpdate);
    return plainToInstance(RentalDto, updatedRental);
  }

  async deleteFile(fileId: number) {
    await this.fileService.remove(fileId);
    return plainToInstance(MessageDto, {
      message: `Le fichier #${fileId} a été supprimé.`,
    });
  }

  async uploadFile(files: File[], user: UserDto, rentalId: number) {
    const getRental = await this.findOne(rentalId);
    if (!getRental) {
      throw new NotFoundException(
        `Impossible de trouver la location #${rentalId}.`,
      );
    }

    if (getRental.user.id !== user.id && user.role !== 'administrator') {
      throw new HttpException('Non autorisé', 401);
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file) => this.fileService.create(file)),
    );

    getRental.images = [
      ...(getRental.images || []),
      ...uploadedFiles,
    ] as File[];

    await this.rentalRepository.save(getRental);
    return plainToInstance(MessageDto, getRental);
  }

  async remove(id: number, user: UserDto) {
    const getRental = await this.findOne(id);

    if (!getRental) {
      throw new NotFoundException(`Impossible de trouver la location #${id}.`);
    }

    if (getRental.user.id !== user.id && user.role !== 'administrator') {
      throw new HttpException('Non autorisé', 401);
    }

    await this.rentalRepository.softDelete(id);

    return {
      message: `La location #${id} a été supprimée.`,
    };
  }

  async getOneRentalFiles(rentalId: number) {
    const rental = await this.findOne(rentalId);
    return rental.images;
  }

  async getAllFilesIds() {
    const rentals = await this.rentalRepository.find({
      select: ['images'],
      relations: ['images'],
    });

    const filesIds = rentals.reduce((acc, rental) => {
      if (rental.images && rental.images.length > 0) {
        rental.images.forEach((image) => {
          acc.push(image.id);
        });
      }
      return acc;
    }, []);

    return filesIds;
  }
}
