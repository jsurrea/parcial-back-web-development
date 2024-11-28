import { BonusEntity } from 'src/bonus/bonus.entity';
import { CourseEntity } from 'src/course/course.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  governmentId: number;

  @Column()
  name: string;

  @Column()
  researchGroup: string;

  @Column({ type: 'int' })
  telephoneExtension: number;

  @Column()
  role: string;

  @ManyToOne(() => UserEntity, (user) => user.employees)
  boss: UserEntity;

  @OneToMany(() => UserEntity, (user) => user.boss)
  employees: UserEntity[];

  @OneToMany(() => CourseEntity, (course) => course.user)
  courses: CourseEntity[];

  @OneToMany(() => BonusEntity, (bonus) => bonus.user)
  bonuses: BonusEntity[];
}
