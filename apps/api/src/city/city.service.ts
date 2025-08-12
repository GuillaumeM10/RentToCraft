import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CityDto } from '@rent-to-craft/dtos';
import slugify from 'slugify';
import { Repository } from 'typeorm';

import { CityEntity } from './entities/city.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
  ) {}

  async create(createCityDto: CityDto) {
    return this.cityRepository.save(createCityDto);
  }

  async findAll() {
    return this.cityRepository.find();
  }

  async findOne(id: number) {
    const city = await this.cityRepository
      .createQueryBuilder('city')
      .leftJoinAndSelect('city.users', 'user')
      .leftJoinAndSelect('user.rentals', 'rental')
      .leftJoinAndSelect('rental.images', 'images')
      .leftJoinAndSelect('rental.cats', 'cats')
      .leftJoinAndSelect('rental.comments', 'comments')
      .leftJoinAndSelect('rental.user', 'owner')
      .leftJoinAndSelect('owner.profilePicture', 'ownerProfilePicture')
      .where('city.id = :cityId', { cityId: id })
      .getOne();

    if (!city) throw new NotFoundException(`Ville #${id} introuvable.`);

    const rentals =
      (city.users || []).flatMap((user) => user.rentals || []) ?? [];
    const rentalsIds = rentals.map((rental) => rental.slug);

    return {
      city,
      rentals: rentalsIds,
    };
  }

  async search(query: string) {
    return this.cityRepository
      .createQueryBuilder('city')
      .where('city.name ILIKE :query', { query: `%${query}%` })
      .limit(20)
      .getMany();
  }

  async update(id: number, updateCityDto: CityDto) {
    return this.cityRepository.update(id, updateCityDto);
  }

  async remove(id: number) {
    return this.cityRepository.delete(id);
  }

  async initData() {
    const citiesInDb = await this.cityRepository.find();

    if (citiesInDb.length > 0) {
      return Logger.log('Villes initialisées');
    }
    const url =
      'https://geo.api.gouv.fr/communes?fields=nom,code,centre&format=json&geometry=centre';

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Échec de récupération des communes: ${res.status}`);
    }

    type GouvCommune = {
      code: string;
      nom: string;
      centre?: { coordinates: [number, number]; type: 'Point' } | null;
    };

    const data = (await res.json()) as GouvCommune[];

    const cities: Array<
      Pick<CityEntity, 'latitude' | 'longitude' | 'name' | 'slug'>
    > = data
      .filter((c) => c.centre && Array.isArray(c.centre.coordinates))
      .map((c) => {
        const [longitude, latitude] = c!.centre!.coordinates;
        return {
          name: c.nom,
          slug: slugify(`${c.nom}-${c.code}`, { lower: true, strict: true }),
          latitude,
          longitude,
        };
      });

    const chunkSize = 1000;
    const upsertPromises = [];
    for (let i = 0; i < cities.length; i += chunkSize) {
      const chunk = cities.slice(i, i + chunkSize);
      upsertPromises.push(this.cityRepository.upsert(chunk, ['slug']));
    }
    await Promise.all(upsertPromises);

    return { imported: cities.length };
  }
}
