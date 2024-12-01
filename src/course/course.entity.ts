import { BonusEntity } from '../bonus/bonus.entity';
import { UserEntity } from '../user/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CourseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ type: 'int' })
  credits: number;

  @ManyToOne(() => UserEntity, (user) => user.courses)
  user: UserEntity;

  @OneToMany(() => BonusEntity, (bonus) => bonus.course)
  bonuses: BonusEntity[];
}
