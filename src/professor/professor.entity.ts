import { ProposalEntity } from 'src/proposal/proposal.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProfessorEntity {
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

  @OneToMany(() => ProposalEntity, (proposal) => proposal.professor)
  proposals: ProposalEntity[];
}
