import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from './project/project.module';
import { ProposalModule } from './proposal/proposal.module';
import { ProfessorModule } from './professor/professor.module';

@Module({
  imports: [
    StudentModule,
    ProjectModule,
    ProposalModule,
    ProfessorModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [StudentModule, ProjectModule, ProposalModule, ProfessorModule],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
      logging: true,
      autoLoadEntities: true,
    }),
  ],
})
export class AppModule {}
