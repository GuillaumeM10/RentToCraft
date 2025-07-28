import { Timestamp } from 'src/generic/timestamp.entity';
import { RentalEntity } from 'src/rental/entities/rental.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('rental_cats')
export class RentalCatEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column({
    unique: true,
  })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => RentalEntity, (rental) => rental.cats, {
    cascade: true,
    nullable: true,
  })
  @JoinTable({
    name: 'rental_cat_rentals',
    joinColumn: {
      name: 'rental_cat_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'rental_id',
      referencedColumnName: 'id',
    },
  })
  rentals: RentalEntity[] | null;
}
