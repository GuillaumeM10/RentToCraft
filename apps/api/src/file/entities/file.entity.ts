import { Timestamp } from 'src/generic/timestamp.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('file')
export class FileEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  file: string;

  @Column()
  name: string;
}
