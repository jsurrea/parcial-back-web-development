import { ProposalEntity } from 'src/proposal/proposal.entity';
import { StudentEntity } from 'src/student/student.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProjectEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  url: string;

  @OneToOne(() => StudentEntity, (student) => student.project)
  student: StudentEntity;

  @OneToOne(() => ProposalEntity, (proposal) => proposal.project)
  proposal: ProposalEntity;
}
