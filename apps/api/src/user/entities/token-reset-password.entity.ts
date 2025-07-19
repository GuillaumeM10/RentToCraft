import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Timestamp } from '../../generic/timestamp.entity';
import { UserEntity } from './user.entity';

@Entity('token_reset_password')
export class TokenResetServiceEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  token: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}
