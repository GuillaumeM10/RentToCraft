import { CartEntity } from 'src/cart/entities/cart.entity';
import { Timestamp } from 'src/generic/timestamp.entity';
import { RentalEntity } from 'src/rental/entities/rental.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cart-item')
export class CartItemEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CartEntity, (cart) => cart.cartItems)
  cart: CartEntity;

  @ManyToOne(() => RentalEntity, (rental) => rental.cartItems)
  rental: RentalEntity;

  @Column({ type: 'int' })
  quantity: number;
}
