import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RentalCatDto } from '@rent-to-craft/dtos';
import { plainToInstance } from 'class-transformer';
import slugify from 'slugify';
import { Repository } from 'typeorm';

import { RentalCatEntity } from './entities/rental-cat.entity';

@Injectable()
export class RentalCatService {
  constructor(
    @InjectRepository(RentalCatEntity)
    private readonly rentalCatRepository: Repository<RentalCatEntity>,
  ) {}

  async create(createRentalCatDto: RentalCatDto) {
    if (!createRentalCatDto.name) {
      throw new HttpException('Le nom est obligatoire.', 400);
    }

    createRentalCatDto.slug = slugify(createRentalCatDto.name, {
      lower: true,
      strict: true,
      locale: 'fr',
    });

    const newCategory = this.rentalCatRepository.create(createRentalCatDto);
    return plainToInstance(
      RentalCatDto,
      await this.rentalCatRepository.save(newCategory),
    );
  }

  async findAll(queries?) {
    const { page, limit, search } = queries || {};

    const query = this.rentalCatRepository.createQueryBuilder('category');

    if (search) {
      query.where(
        'category.name ILIKE :search OR category.description ILIKE :search',
        { search: `%${search}%` },
      );
    }

    if (page && limit) {
      query.skip(page * limit).take(limit);
    }

    const categories = await query
      .orderBy('category.name', 'ASC')
      .leftJoinAndSelect('category.rentals', 'rentals')
      .getMany();

    if (categories === null || categories.length === 0) {
      throw new NotFoundException('Aucune catégorie trouvée');
    }

    return categories.map((category) =>
      plainToInstance(RentalCatDto, category),
    );
  }

  async findOne(id: number) {
    const category = await this.rentalCatRepository
      .createQueryBuilder('category')
      .where('category.id = :id', { id })
      .leftJoinAndSelect('category.rentals', 'rentals')
      .leftJoinAndSelect('rentals.images', 'images')
      .getOne();

    if (!category) {
      throw new NotFoundException(`Impossible de trouver la catégorie #${id}.`);
    }

    return plainToInstance(RentalCatDto, category);
  }

  async findBySlug(slug: string) {
    const category = await this.rentalCatRepository
      .createQueryBuilder('category')
      .where('category.slug = :slug', { slug })
      .leftJoinAndSelect('category.rentals', 'rentals')
      .leftJoinAndSelect('rentals.images', 'images')
      .getOne();

    if (!category) {
      throw new NotFoundException(
        `Impossible de trouver la catégorie ${slug}.`,
      );
    }

    return plainToInstance(RentalCatDto, category);
  }

  async update(id: number, updateRentalCatDto: RentalCatDto) {
    const getCategory = await this.findOne(id);

    if (!getCategory) {
      throw new NotFoundException(`Impossible de trouver la catégorie #${id}.`);
    }

    if (
      updateRentalCatDto.name &&
      updateRentalCatDto.name !== getCategory.name
    ) {
      updateRentalCatDto.slug = slugify(updateRentalCatDto.name, {
        lower: true,
        strict: true,
        locale: 'fr',
      });
    }

    const categoryUpdate = {
      ...getCategory,
      ...updateRentalCatDto,
    };

    await this.rentalCatRepository.save(categoryUpdate);
    return plainToInstance(RentalCatDto, categoryUpdate);
  }

  async remove(id: number) {
    const getCategory = await this.findOne(id);

    if (!getCategory) {
      throw new NotFoundException(`Impossible de trouver la catégorie #${id}.`);
    }

    await this.rentalCatRepository.softDelete(id);

    return {
      message: `La catégorie #${id} a été supprimée.`,
    };
  }
}
