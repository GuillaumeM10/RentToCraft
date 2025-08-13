import { UserRole } from '@rent-to-craft/dtos';
import { CityEntity } from 'src/city/entities/city.entity';
import { FileEntity } from 'src/file/entities/file.entity';
import { OrderEntity } from 'src/order/entities/order.entity';
import { RentalEntity } from 'src/rental/entities/rental.entity';
import { RentalCommentEntity } from 'src/rental-comment/entities/rental-comment.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Timestamp } from '../../generic/timestamp.entity';
import { ValidTokenEntity } from '../../valid-token/entities/valid-token.entity';

@Entity('user')
export class UserEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;
  @Column({
    nullable: false,
    select: false,
  })
  password: string;

  @Column({ nullable: true })
  firstName: string;
  @Column({ nullable: true })
  lastName: string;
  @Column({ nullable: true })
  description: string;
  @Column({ nullable: true })
  address: string;
  @Column({ nullable: true, type: 'bigint' })
  phone: string;
  @Column({ nullable: true })
  contactEmail: string;

  @Column({
    default: false,
  })
  isPublic: boolean = false;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.user })
  role: UserRole;

  @OneToMany(() => ValidTokenEntity, (validToken) => validToken.user, {
    cascade: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  tokens?: ValidTokenEntity[];

  @OneToOne(() => FileEntity, {
    cascade: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  profilePicture: FileEntity;

  @OneToOne(() => FileEntity, {
    cascade: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  banner: FileEntity;

  @OneToMany(() => RentalEntity, (rental) => rental.user, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  rentals: RentalEntity[];

  @OneToMany(() => RentalCommentEntity, (comment) => comment.author, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  rentalComments: RentalCommentEntity[];

  @OneToOne(() => CityEntity, (city) => city.users, {
    nullable: true,
  })
  @JoinColumn()
  city: CityEntity;

  @OneToMany(() => OrderEntity, (order) => order.user, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  orders: OrderEntity[];

  // posts Post
  // postComments PostComment
}
