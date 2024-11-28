import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstudianteEntity } from './estudiante.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,
  ) {}

  async findAll(): Promise<EstudianteEntity[]> {
    return await this.estudianteRepository.find({ relations: ['project'] });
  }

  async findOne(id: string): Promise<EstudianteEntity> {
    const estudiante: EstudianteEntity =
      await this.estudianteRepository.findOne({
        where: { id },
        relations: ['project'],
      });
    if (!estudiante)
      throw new BusinessLogicException(
        'The estudiante with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return estudiante;
  }

  async create(estudiante: EstudianteEntity): Promise<EstudianteEntity> {
    return await this.estudianteRepository.save(estudiante);
  }

  async update(
    id: string,
    estudiante: EstudianteEntity,
  ): Promise<EstudianteEntity> {
    const persistedEstudiante: EstudianteEntity =
      await this.estudianteRepository.findOne({
        where: { id },
      });
    if (!persistedEstudiante)
      throw new BusinessLogicException(
        'The estudiante with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.estudianteRepository.save({
      ...persistedEstudiante,
      ...estudiante,
    });
  }

  async delete(id: string) {
    const estudiante: EstudianteEntity =
      await this.estudianteRepository.findOne({
        where: { id },
      });
    if (!estudiante)
      throw new BusinessLogicException(
        'The estudiante with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.estudianteRepository.remove(estudiante);
  }
}
