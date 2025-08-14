import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartDto, UserDto } from '@rent-to-craft/dtos';
import { Repository } from 'typeorm';

import { CartEntity } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {}

  async create(user: UserDto) {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (cart) {
      throw new BadRequestException('Le panier existe déjà');
    }

    return this.cartRepository.save({
      user,
    });
  }

  async findAll() {
    return this.cartRepository.find();
  }

  async findOne(userId: number) {
    const cart = await this.cartRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.cartItems', 'cartItems')
      .leftJoinAndSelect('cartItems.rental', 'rental')
      .leftJoinAndSelect('rental.images', 'images')
      .leftJoinAndSelect('rental.user', 'user')
      .leftJoinAndSelect('user.profilePicture', 'profilePicture')
      .where('cart.user.id = :userId', { userId })
      .getOne();

    if (!cart) {
      throw new NotFoundException('Panier introuvable');
    }
    return cart;
  }

  async update(id: number, updateCartDto: CartDto) {
    return this.cartRepository.update(id, updateCartDto);
  }

  async remove(id: number) {
    return this.cartRepository.delete(id);
  }
}
