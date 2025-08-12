import { CartItemEntity } from 'src/cart-item/entities/cart-item.entity';
import { Timestamp } from 'src/generic/timestamp.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cart')
export class CartEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart, {
    cascade: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  cartItems: CartItemEntity[];

  @OneToOne(() => UserEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity;
}
