import { ProfessorEntity } from 'src/professor/professor.entity';
import { ProjectEntity } from 'src/project/project.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ProposalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  keyword: string;

  @ManyToOne(() => ProfessorEntity, (professor) => professor.proposals)
  professor: ProfessorEntity;

  @OneToOne(() => ProjectEntity, (project) => project.proposal)
  @JoinColumn()
  project: ProjectEntity;
}
