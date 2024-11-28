import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseEntity } from './course.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
  ) {}

  async findClaseById(id: string): Promise<CourseEntity> {
    const course: CourseEntity = await this.courseRepository.findOne({
      where: { id },
      relations: ['user', 'bonuses'],
    });
    if (!course)
      throw new BusinessLogicException(
        'The course with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return course;
  }

  async crearClase(course: CourseEntity): Promise<CourseEntity> {
    if (course.code.length !== 10) {
      throw new BusinessLogicException(
        'The course code must be 10 characters long',
        BusinessError.INVALID_DATA,
      );
    }
    return await this.courseRepository.save(course);
  }
}
