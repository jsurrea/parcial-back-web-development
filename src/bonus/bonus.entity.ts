import { CourseEntity } from 'src/course/course.entity';
import { UserEntity } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BonusEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'double' })
  rating: number;

  @Column()
  keyword: string;

  @ManyToOne(() => UserEntity, (user) => user.bonuses)
  user: UserEntity;

  @ManyToOne(() => CourseEntity, (course) => course.bonuses)
  course: CourseEntity;
}
