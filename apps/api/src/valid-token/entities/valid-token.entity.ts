import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Timestamp } from '../../generic/timestamp.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('valid_token')
export class ValidTokenEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true,
  })
  token: string;

  @ManyToOne(() => UserEntity, (user) => user.tokens, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinTable()
  user: UserEntity;
}
