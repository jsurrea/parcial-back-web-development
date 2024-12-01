import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findUsuarioById', () => {
    it('should return a user when the user is found', async () => {
      const user = { id: '1', employees: [], courses: [], bonuses: [] };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findUsuarioById('1');
      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['employees', 'courses', 'bonuses'],
      });
    });

    it('should throw an exception when the user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findUsuarioById('1')).rejects.toThrow(
        new BusinessLogicException(
          'The user with the given id was not found',
          BusinessError.NOT_FOUND,
        ),
      );
    });
  });

  describe('crearUsuario', () => {
    it('should create a user successfully', async () => {
      const user = { role: 'professor', researchGroup: 'TICSW' };
      mockUserRepository.save.mockResolvedValue(user);

      const result = await service.crearUsuario(user as UserEntity);
      expect(result).toEqual(user);
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
    });

    it('should throw an exception for an invalid research group', async () => {
      const user = { role: 'professor', researchGroup: 'INVALID_GROUP' };

      await expect(service.crearUsuario(user as UserEntity)).rejects.toThrow(
        new BusinessLogicException(
          'The research group is not valid for the professor',
          BusinessError.INVALID_DATA,
        ),
      );
    });

    it('should throw an exception for an invalid dean telephone extension', async () => {
      const user = { role: 'dean', telephoneExtension: '123' };

      await expect(service.crearUsuario(user as UserEntity)).rejects.toThrow(
        new BusinessLogicException(
          'The telephone extension for deans should have 8 digits',
          BusinessError.INVALID_DATA,
        ),
      );
    });
  });

  describe('eliminarUsuario', () => {
    it('should delete a user successfully', async () => {
      const user = { id: '1', role: 'professor', bonuses: [] };
      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.remove.mockResolvedValue(undefined);

      await service.eliminarUsuario('1');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(mockUserRepository.remove).toHaveBeenCalledWith(user);
    });

    it('should throw an exception when the user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.eliminarUsuario('1')).rejects.toThrow(
        new BusinessLogicException(
          'The user with the given id was not found',
          BusinessError.NOT_FOUND,
        ),
      );
    });

    it('should throw an exception if the user is a dean', async () => {
      const user = { id: '1', role: 'dean', bonuses: [] };
      mockUserRepository.findOne.mockResolvedValue(user);

      await expect(service.eliminarUsuario('1')).rejects.toThrow(
        new BusinessLogicException(
          'The user is a dean',
          BusinessError.PRECONDITION_FAILED,
        ),
      );
    });

    it('should throw an exception if the user has bonuses', async () => {
      const user = { id: '1', role: 'professor', bonuses: [{}] };
      mockUserRepository.findOne.mockResolvedValue(user);

      await expect(service.eliminarUsuario('1')).rejects.toThrow(
        new BusinessLogicException(
          'The user has associated bonuses',
          BusinessError.PRECONDITION_FAILED,
        ),
      );
    });
  });
});
