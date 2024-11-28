import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findUsuarioById(id: string): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id },
      relations: ['boss', 'employees', 'courses', 'bonuses'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return user;
  }

  async crearUsuario(user: UserEntity): Promise<UserEntity> {
    const availableResearchGroups = ['TICSW', 'IMAGINE', 'COMIT'];
    if (
      user.role === 'professor' &&
      !availableResearchGroups.includes(user.researchGroup)
    )
      throw new BusinessLogicException(
        'The research group is not valid for the professor',
        BusinessError.INVALID_DATA,
      );
    if (user.role === 'dean' && String(user.telephoneExtension).length !== 8)
      throw new BusinessLogicException(
        'The telephone extension for deans should have 8 digits',
        BusinessError.INVALID_DATA,
      );
    return await this.userRepository.save(user);
  }

  async eliminarUsuario(id: string) {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id },
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    if (user.role === 'dean') {
      throw new BusinessLogicException(
        'The user is a dean',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    if (user.bonuses.length > 0) {
      throw new BusinessLogicException(
        'The user has associated bonuses',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    await this.userRepository.remove(user);
  }
}
