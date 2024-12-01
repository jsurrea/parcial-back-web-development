import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BonusEntity } from './bonus.entity';
import { CourseEntity } from '../course/course.entity';
import { UserEntity } from '../user/user.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class BonusService {
  constructor(
    @InjectRepository(BonusEntity)
    private readonly bonusRepository: Repository<BonusEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAllBonosByUsuario(userId: string): Promise<BonusEntity[]> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bonuses'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return user.bonuses;
  }

  async findBonosByCodigo(cod: string): Promise<BonusEntity[]> {
    const course: CourseEntity = await this.courseRepository.findOne({
      where: { code: cod },
      relations: ['bonuses'],
    });
    if (!course)
      throw new BusinessLogicException(
        'The course with the given code was not found',
        BusinessError.NOT_FOUND,
      );

    return course.bonuses;
  }

  async crearBono(bonus: BonusEntity, userId: string): Promise<BonusEntity> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bonuses'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    bonus.user = user;

    if (bonus.amount <= 0) {
      throw new BusinessLogicException(
        'The bonus amount must be positive',
        BusinessError.INVALID_DATA,
      );
    }

    if (user.role !== 'professor') {
      throw new BusinessLogicException(
        'The user associated with the bonus must be a professor',
        BusinessError.INVALID_DATA,
      );
    }

    return await this.bonusRepository.save(bonus);
  }

  async deleteBono(id: string) {
    const bonus: BonusEntity = await this.bonusRepository.findOne({
      where: { id },
    });
    if (!bonus)
      throw new BusinessLogicException(
        'The bonus with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    if (bonus.rating > 4) {
      throw new BusinessLogicException(
        'The bonus has rating above 4.0',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    await this.bonusRepository.remove(bonus);
  }
}
