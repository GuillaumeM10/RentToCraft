import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Timestamp } from '../../generic/timestamp.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('token-reset-password')
export class TokenResetPasswordEntity extends Timestamp {
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
