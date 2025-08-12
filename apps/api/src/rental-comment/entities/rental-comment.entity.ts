import { Timestamp } from 'src/generic/timestamp.entity';
import { RentalEntity } from 'src/rental/entities/rental.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rental_comment')
export class RentalCommentEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => RentalEntity, (rental) => rental.comments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  rental: RentalEntity;

  @ManyToOne(() => UserEntity, (user) => user.rentalComments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  author: UserEntity;
}
