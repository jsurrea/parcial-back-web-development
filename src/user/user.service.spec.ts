import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { UserEntity } from './user.entity';
import { BonusEntity } from '../bonus/bonus.entity';
import { UserService } from './user.service';

import { faker } from '@faker-js/faker';

describe(UserService, () => {
  let service: UserService;
  let repository: Repository<UserEntity>;
  let usersList: UserEntity[];
  let bonusesList: BonusEntity[];
  let bonusRepository: Repository<BonusEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    bonusRepository = module.get<Repository<BonusEntity>>(
      getRepositoryToken(BonusEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    bonusRepository.clear();

    bonusesList = [];
    for (let i = 0; i < 5; i++) {
      const bonus: BonusEntity = await bonusRepository.save({
        amount: faker.number.int(),
        rating: faker.number.float({ min: 0, max: 5, fractionDigits: 2 }),
        keyword: faker.lorem.word(),
      });
      bonusesList.push(bonus);
    }

    usersList = [];
    for (let i = 0; i < 5; i++) {
      const user: UserEntity = await repository.save({
        governmentId: faker.number.int(),
        name: faker.person.fullName(),
        researchGroup: faker.helpers.arrayElement([
          'TICSW',
          'IMAGINE',
          'COMIT',
        ]),
        telephoneExtension: faker.number.int({ min: 10000000, max: 99999999 }),
        role: faker.helpers.arrayElement(['professor', 'dean']),
        bonuses: bonusesList,
      });
      usersList.push(user);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findUsuarioById should return a user by id', async () => {
    const storedUser: UserEntity = usersList[0];
    const user: UserEntity = await service.findUsuarioById(storedUser.id);
    expect(user).not.toBeNull();
    expect(user.governmentId).toEqual(storedUser.governmentId);
    expect(user.name).toEqual(storedUser.name);
    expect(user.researchGroup).toEqual(storedUser.researchGroup);
    expect(user.telephoneExtension).toEqual(storedUser.telephoneExtension);
    expect(user.role).toEqual(storedUser.role);
  });

  it('findUsuarioById should throw an exception for an invalid user', async () => {
    await expect(() =>
      service.findUsuarioById('0000-0000-0000-0000'),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('crearUsuario should return a new user', async () => {
    const user: UserEntity = {
      id: '',
      governmentId: faker.number.int(),
      name: faker.person.fullName(),
      researchGroup: faker.helpers.arrayElement(['TICSW', 'IMAGINE', 'COMIT']),
      telephoneExtension: faker.number.int({ min: 10000000, max: 99999999 }),
      role: faker.helpers.arrayElement(['professor', 'dean']),
      bossId: '',
      bonuses: [],
      courses: [],
    };

    const newUser: UserEntity = await service.crearUsuario(user);
    expect(newUser).not.toBeNull();

    const storedUser: UserEntity = await repository.findOne({
      where: { id: newUser.id },
    });
    expect(storedUser).not.toBeNull();
    expect(storedUser.governmentId).toEqual(user.governmentId);
    expect(storedUser.name).toEqual(user.name);
    expect(storedUser.researchGroup).toEqual(user.researchGroup);
    expect(storedUser.telephoneExtension).toEqual(user.telephoneExtension);
    expect(storedUser.role).toEqual(user.role);
  });

  it('crearUsuario should throw an exception for an invalid professor', async () => {
    const user: UserEntity = {
      id: '',
      governmentId: faker.number.int(),
      name: faker.person.fullName(),
      researchGroup: 'INVALID',
      telephoneExtension: faker.number.int({ min: 10000000, max: 99999999 }),
      role: 'professor',
      bossId: '',
      bonuses: [],
      courses: [],
    };

    await expect(() => service.crearUsuario(user)).rejects.toHaveProperty(
      'message',
      'The research group is not valid for the professor',
    );
  });

  it('crearUsuario should throw an exception for an invalid dean', async () => {
    const user: UserEntity = {
      id: '',
      governmentId: faker.number.int(),
      name: faker.person.fullName(),
      researchGroup: faker.helpers.arrayElement(['TICSW', 'IMAGINE', 'COMIT']),
      telephoneExtension: faker.number.int({ min: 1000000, max: 9999999 }),
      role: 'dean',
      bossId: '',
      bonuses: [],
      courses: [],
    };

    await expect(() => service.crearUsuario(user)).rejects.toHaveProperty(
      'message',
      'The telephone extension for deans should have 8 digits',
    );
  });

  it('eliminarUsuario should remove a user', async () => {
    const user: UserEntity = usersList[0];
    user.bonuses = [];
    user.role = 'professor';
    await repository.save(user);
    await service.eliminarUsuario(user.id);

    const deletedUser: UserEntity = await repository.findOne({
      where: { id: user.id },
    });
    expect(deletedUser).toBeNull();
  });

  it('eliminarUsuario should throw an exception for an invalid user', async () => {
    await expect(() =>
      service.eliminarUsuario('0000-0000-0000-0000'),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('eliminarUsuario should throw an exception for a dean', async () => {
    const user: UserEntity = usersList[0];
    user.role = 'dean';
    user.bonuses = [];
    await repository.save(user);
    await repository.save(user);

    await expect(() => service.eliminarUsuario(user.id)).rejects.toHaveProperty(
      'message',
      'The user is a dean',
    );
  });

  it('eliminarUsuario should throw an exception for a user with bonuses', async () => {
    const user: UserEntity = usersList[0];
    user.role = 'professor';
    await repository.save(user);

    await expect(() => service.eliminarUsuario(user.id)).rejects.toHaveProperty(
      'message',
      'The user has associated bonuses',
    );
  });
});
