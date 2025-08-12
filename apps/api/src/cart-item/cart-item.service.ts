import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemDto, UserDto } from '@rent-to-craft/dtos';
import { CartService } from 'src/cart/cart.service';
import { Repository } from 'typeorm';

import { CartItemEntity } from './entities/cart-item.entity';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
    @Inject(forwardRef(() => CartService))
    private readonly cartService: CartService,
  ) {}

  async create(createCartItemDto: CartItemDto, user: UserDto) {
    const cart = await this.cartService.findOne(user.id);
    const cartItem = this.cartItemRepository.create({
      quantity: createCartItemDto.quantity,
      cart,
      rental: { id: createCartItemDto.rental.id },
    });

    return this.cartItemRepository.save(cartItem);
  }

  async findAll(cartId: number) {
    return this.cartItemRepository
      .createQueryBuilder('cartItem')
      .leftJoinAndSelect('cartItem.cart', 'cart')
      .leftJoinAndSelect('cartItem.rental', 'rental')
      .leftJoinAndSelect('rental.images', 'images')
      .leftJoinAndSelect('rental.user', 'user')
      .leftJoinAndSelect('user.profilePicture', 'profilePicture')
      .where('cartItem.cart = :cartId', { cartId })
      .getMany();
  }

  async findOne(id: number) {
    const cart = await this.cartItemRepository
      .createQueryBuilder('cartItem')
      .leftJoinAndSelect('cartItem.cart', 'cart')
      .leftJoinAndSelect('cartItem.rental', 'rental')
      .leftJoinAndSelect('rental.images', 'images')
      .leftJoinAndSelect('rental.user', 'user')
      .leftJoinAndSelect('user.profilePicture', 'profilePicture')
      .where('cartItem.id = :id', { id })
      .getOne();

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return this.cartItemRepository.findOne({ where: { id, cart } });
  }

  async update(id: number, updateCartItemDto: CartItemDto) {
    if (updateCartItemDto.quantity === 0) {
      return this.remove(id);
    }
    return this.cartItemRepository.update(id, updateCartItemDto);
  }

  async remove(id: number) {
    return this.cartItemRepository.delete(id);
  }

  async removeAll(user: UserDto) {
    const cart = await this.cartService.findOne(user.id);
    return this.cartItemRepository.delete({ cart });
  }
}
