import { Timestamp } from 'src/generic/timestamp.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('city')
export class CityEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    unique: true,
    nullable: true,
  })
  slug: string;

  @Column({ type: 'double precision' })
  latitude: number;

  @Column({ type: 'double precision' })
  longitude: number;

  @OneToMany(() => UserEntity, (user) => user.city, {
    cascade: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  users: UserEntity[];
}
