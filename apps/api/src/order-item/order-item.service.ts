import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItemDto } from '@rent-to-craft/dtos';
import { OrderService } from 'src/order/order.service';
import { Repository } from 'typeorm';

import { OrderItemEntity } from './entities/order-item.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
  ) {}

  async findAll(orderId: number) {
    const orderItems = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .leftJoinAndSelect('orderItem.order', 'order')
      .leftJoinAndSelect('orderItem.rental', 'rental')
      .leftJoinAndSelect('rental.images', 'images')
      .leftJoinAndSelect('rental.user', 'user')
      .where('orderItem.order = :orderId', { orderId })
      .getMany();

    if (!orderItems) {
      throw new NotFoundException('Éléments de commande introuvables');
    }

    return orderItems;
  }

  async findOne(id: number) {
    const orderItem = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .leftJoinAndSelect('orderItem.order', 'order')
      .leftJoinAndSelect('orderItem.rental', 'rental')
      .leftJoinAndSelect('rental.images', 'images')
      .leftJoinAndSelect('rental.user', 'user')
      .where('orderItem.id = :id', { id })
      .getOne();

    if (!orderItem) {
      throw new NotFoundException('Élément de commande introuvable');
    }

    return orderItem;
  }

  async update(id: number, updateOrderItemDto: OrderItemDto) {
    return this.orderItemRepository.update(id, updateOrderItemDto);
  }

  async remove(id: number) {
    return this.orderItemRepository.delete(id);
  }
}
