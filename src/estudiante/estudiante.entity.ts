import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EstudianteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ type: 'int' })
  credits: number;

  //@OneToOne(() => ProjectEntity, (project) => project.estudiante)
  //project: ProjectEntity;
}
