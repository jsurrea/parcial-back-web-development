import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessorEntity } from './professor.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class ProfessorService {
  constructor(
    @InjectRepository(ProfessorEntity)
    private readonly professorRepository: Repository<ProfessorEntity>,
  ) {}

  async findAll(): Promise<ProfessorEntity[]> {
    return await this.professorRepository.find({ relations: ['proposals'] });
  }

  async findOne(id: string): Promise<ProfessorEntity> {
    const professor: ProfessorEntity = await this.professorRepository.findOne({
      where: { id },
      relations: ['proposals'],
    });
    if (!professor)
      throw new BusinessLogicException(
        'The professor with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return professor;
  }

  async create(professor: ProfessorEntity): Promise<ProfessorEntity> {
    return await this.professorRepository.save(professor);
  }

  async update(
    id: string,
    professor: ProfessorEntity,
  ): Promise<ProfessorEntity> {
    const persistedProfessor: ProfessorEntity =
      await this.professorRepository.findOne({
        where: { id },
      });
    if (!persistedProfessor)
      throw new BusinessLogicException(
        'The professor with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.professorRepository.save({
      ...persistedProfessor,
      ...professor,
    });
  }

  async delete(id: string) {
    const professor: ProfessorEntity = await this.professorRepository.findOne({
      where: { id },
    });
    if (!professor)
      throw new BusinessLogicException(
        'The professor with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.professorRepository.remove(professor);
  }
}
