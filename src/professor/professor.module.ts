import { Module } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessorEntity } from './professor.entity';
import { ProfessorController } from './professor.controller';

@Module({
  providers: [ProfessorService],
  imports: [TypeOrmModule.forFeature([ProfessorEntity])],
  controllers: [ProfessorController],
})
export class ProfessorModule {}
