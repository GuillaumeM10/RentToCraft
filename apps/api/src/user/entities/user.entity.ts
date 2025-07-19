import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({
    nullable: true,
  })
  firstName: string;

  @Column({
    nullable: true,
  })
  lastName: string;

  @OneToMany(() => ValidTokenEntity, (validToken) => validToken.user, {
    cascade: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  tokens?: ValidTokenEntity[];
}
