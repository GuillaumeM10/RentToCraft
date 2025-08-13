import { OrderStatus } from '@rent-to-craft/dtos';
import { Timestamp } from 'src/generic/timestamp.entity';
import { OrderItemEntity } from 'src/order-item/entities/order-item.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('order')
export class OrderEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order, {
    cascade: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  orderItems: OrderItemEntity[];

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @Column({ default: 0, type: 'float' })
  total: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.pending })
  status: OrderStatus;
}
