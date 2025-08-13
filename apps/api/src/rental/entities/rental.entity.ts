import { CartItemEntity } from 'src/cart-item/entities/cart-item.entity';
import { FileEntity } from 'src/file/entities/file.entity';
import { Timestamp } from 'src/generic/timestamp.entity';
import { OrderItemEntity } from 'src/order-item/entities/order-item.entity';
import { RentalCatEntity } from 'src/rental-cat/entities/rental-cat.entity';
import { RentalCommentEntity } from 'src/rental-comment/entities/rental-comment.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('rental')
export class RentalEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column({
    unique: true,
    nullable: true,
  })
  slug: string;
  @Column({ nullable: true })
  description: string;
  @Column({ default: 1 })
  quantity: number;

  @ManyToOne(() => UserEntity, (user) => user.rentals)
  user: UserEntity;

  @ManyToMany(() => FileEntity, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'rental_images',
    joinColumn: {
      name: 'rental_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'file_id',
      referencedColumnName: 'id',
    },
  })
  images: FileEntity[];

  @ManyToMany(() => RentalCatEntity, (cat) => cat.rentals, {
    nullable: true,
  })
  @JoinTable({
    name: 'rental_cat_rentals',
    joinColumn: {
      name: 'rental_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'rental_cat_id',
      referencedColumnName: 'id',
    },
  })
  cats: RentalCatEntity[] | null;

  @OneToMany(() => RentalCommentEntity, (comment) => comment.rental, {
    cascade: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  comments: RentalCommentEntity[] | null;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.rental, {
    cascade: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  cartItems: CartItemEntity[];

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.rental)
  orderItems: OrderItemEntity[];
}
