import { BonusEntity } from '../bonus/bonus.entity';
import { CourseEntity } from '../course/course.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ nullable: true })
  bossId: string;

  @OneToMany(() => CourseEntity, (course) => course.user)
  courses: CourseEntity[];

  @OneToMany(() => BonusEntity, (bonus) => bonus.user)
  bonuses: BonusEntity[];
}
