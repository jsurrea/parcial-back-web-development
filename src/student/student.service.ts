import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentEntity } from './student.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
  ) {}

  async findAll(): Promise<StudentEntity[]> {
    return await this.studentRepository.find({ relations: ['project'] });
  }

  async findOne(id: string): Promise<StudentEntity> {
    const student: StudentEntity = await this.studentRepository.findOne({
      where: { id },
      relations: ['project'],
    });
    if (!student)
      throw new BusinessLogicException(
        'The student with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return student;
  }

  async create(student: StudentEntity): Promise<StudentEntity> {
    return await this.studentRepository.save(student);
  }

  async update(id: string, student: StudentEntity): Promise<StudentEntity> {
    const persistedStudent: StudentEntity =
      await this.studentRepository.findOne({
        where: { id },
      });
    if (!persistedStudent)
      throw new BusinessLogicException(
        'The student with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.studentRepository.save({
      ...persistedStudent,
      ...student,
    });
  }

  async delete(id: string) {
    const student: StudentEntity = await this.studentRepository.findOne({
      where: { id },
    });
    if (!student)
      throw new BusinessLogicException(
        'The student with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.studentRepository.remove(student);
  }
}
