import { ProjectEntity } from 'src/project/project.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class StudentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ type: 'int' })
  credits: number;

  @OneToOne(() => ProjectEntity, (project) => project.student)
  @JoinColumn()
  project: ProjectEntity;
}
