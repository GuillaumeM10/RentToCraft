import { Timestamp } from 'src/generic/timestamp.entity';
import { OrderEntity } from 'src/order/entities/order.entity';
import { RentalEntity } from 'src/rental/entities/rental.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity('order-item')
export class OrderItemEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderEntity)
  @JoinColumn()
  order: OrderEntity;

  @ManyToOne(() => RentalEntity, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn()
  rental: RentalEntity;

  @Column({ default: 1 })
  quantity: number;
}
