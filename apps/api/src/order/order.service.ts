import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDto, UserDto } from '@rent-to-craft/dtos';
import { CartItemService } from 'src/cart-item/cart-item.service';
import { Repository } from 'typeorm';

import { OrderEntity } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @Inject(forwardRef(() => CartItemService))
    private readonly cartItemService: CartItemService,
  ) {}

  async create(createOrderDto: OrderDto, user: UserDto) {
    const order = this.orderRepository.create({
      user,
      total: createOrderDto.total ?? 0,
      orderItems: createOrderDto.orderItems,
    });

    try {
      const savedOrder = await this.orderRepository.save(order);
      await this.cartItemService.removeAll(user);
      return savedOrder;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    return this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.rental', 'rental')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('rental.images', 'images')
      .orderBy('order.createdAt', 'DESC')
      .getMany();
  }

  async findAllByUser(userId: number) {
    return this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.rental', 'rental')
      .leftJoinAndSelect('rental.images', 'images')
      .leftJoinAndSelect('rental.user', 'user')
      .leftJoinAndSelect('user.city', 'city')
      .where('order.user = :userId', { userId })
      .orderBy('order.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: number) {
    return this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.rental', 'rental')
      .leftJoinAndSelect('rental.images', 'images')
      .leftJoinAndSelect('rental.user', 'user')
      .leftJoinAndSelect('user.city', 'city')
      .where('order.id = :id', { id })
      .getOne();
  }

  async update(id: number, updateOrderDto: OrderDto) {
    return this.orderRepository.update(id, updateOrderDto);
  }

  async remove(id: number) {
    await this.orderRepository
      .createQueryBuilder()
      .delete()
      .from('order-item')
      .where('orderId = :orderId', { orderId: id })
      .execute();

    return this.orderRepository.delete(id);
  }
}
