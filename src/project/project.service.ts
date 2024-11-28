import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from './project.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
  ) {}

  async findAll(): Promise<ProjectEntity[]> {
    return await this.projectRepository.find({
      relations: ['student', 'proposal'],
    });
  }

  async findOne(id: string): Promise<ProjectEntity> {
    const project: ProjectEntity = await this.projectRepository.findOne({
      where: { id },
      relations: ['student', 'proposal'],
    });
    if (!project)
      throw new BusinessLogicException(
        'The project with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return project;
  }

  async create(project: ProjectEntity): Promise<ProjectEntity> {
    return await this.projectRepository.save(project);
  }

  async update(id: string, project: ProjectEntity): Promise<ProjectEntity> {
    const persistedProject: ProjectEntity =
      await this.projectRepository.findOne({
        where: { id },
      });
    if (!persistedProject)
      throw new BusinessLogicException(
        'The project with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.projectRepository.save({
      ...persistedProject,
      ...project,
    });
  }

  async delete(id: string) {
    const project: ProjectEntity = await this.projectRepository.findOne({
      where: { id },
    });
    if (!project)
      throw new BusinessLogicException(
        'The project with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.projectRepository.remove(project);
  }
}
