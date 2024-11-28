import { ProjectEntity } from 'src/project/project.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

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
  project: ProjectEntity;
}
