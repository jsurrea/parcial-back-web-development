import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { BonusEntity } from './bonus.entity';
import { BonusService } from './bonus.service';
import { UserEntity } from '../user/user.entity';
import { CourseEntity } from '../course/course.entity';

import { faker } from '@faker-js/faker';

describe(BonusService, () => {
  let service: BonusService;
  let repository: Repository<BonusEntity>;
  let bonusesList: BonusEntity[];
  let user: UserEntity;
  let userRepository: Repository<UserEntity>;
  let course: CourseEntity;
  let courseRepository: Repository<CourseEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BonusService],
    }).compile();

    service = module.get<BonusService>(BonusService);
    repository = module.get<Repository<BonusEntity>>(
      getRepositoryToken(BonusEntity),
    );
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    courseRepository = module.get<Repository<CourseEntity>>(
      getRepositoryToken(CourseEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    userRepository.clear();
    courseRepository.clear();

    user = await userRepository.save({
      governmentId: faker.number.int(),
      name: faker.person.fullName(),
      researchGroup: faker.helpers.arrayElement(['TICSW', 'IMAGINE', 'COMIT']),
      telephoneExtension: faker.number.int({ min: 10000000, max: 99999999 }),
      role: 'professor',
      bonuses: [],
      courses: [],
    });

    course = await courseRepository.save({
      name: faker.lorem.words(),
      code: faker.lorem.word({ length: 10 }),
      credits: faker.number.int({ min: 1, max: 5 }),
      bonuses: [],
      user,
    });

    bonusesList = [];
    for (let i = 0; i < 5; i++) {
      const bonus: BonusEntity = await repository.save({
        amount: faker.number.int(),
        rating: faker.number.float({ min: 0, max: 5, fractionDigits: 2 }),
        keyword: faker.lorem.word(),
        user,
        course,
      });
      bonusesList.push(bonus);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAllBonosByUsuario should return all bonus by user id', async () => {
    const bonuses: BonusEntity[] = await service.findAllBonosByUsuario(user.id);
    expect(bonuses).toHaveLength(bonusesList.length);
  });

  it('findAllBonosByUsuario should throw an exception for an invalid user id', async () => {
    await expect(() =>
      service.findAllBonosByUsuario('0000-0000-0000-0000'),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('findBonosByCodigo should return all bonus by course code', async () => {
    const bonuses: BonusEntity[] = await service.findBonosByCodigo(course.code);
    expect(bonuses).toHaveLength(bonusesList.length);
  });

  it('findBonosByCodigo should throw an exception for an invalid course code', async () => {
    await expect(() =>
      service.findBonosByCodigo('0000-0000-0000-0000'),
    ).rejects.toHaveProperty(
      'message',
      'The course with the given code was not found',
    );
  });

  it('crearBono should return a new bonus', async () => {
    const bonus: BonusEntity = {
      id: '',
      amount: faker.number.int(),
      rating: faker.number.float({ min: 0, max: 5, fractionDigits: 2 }),
      keyword: faker.lorem.word(),
      course: null,
      user: null,
    };

    const newBonus: BonusEntity = await service.crearBono(bonus, user.id);
    expect(newBonus).not.toBeNull();

    const storedBonus: BonusEntity = await repository.findOne({
      where: { id: newBonus.id },
    });
    expect(storedBonus).not.toBeNull();
  });

  it('crearBono should throw an exception for an invalid user', async () => {
    const bonus: BonusEntity = {
      id: '',
      amount: faker.number.int(),
      rating: faker.number.float({ min: 0, max: 5, fractionDigits: 2 }),
      keyword: faker.lorem.word(),
      course: null,
      user: null,
    };

    await expect(() => service.crearBono(bonus, '')).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('crearBono should throw an exception for an invalid amount', async () => {
    const bonus: BonusEntity = {
      id: '',
      amount: 0,
      rating: faker.number.float({ min: 0, max: 5, fractionDigits: 2 }),
      keyword: faker.lorem.word(),
      course: null,
      user: null,
    };

    await expect(() =>
      service.crearBono(bonus, user.id),
    ).rejects.toHaveProperty('message', 'The bonus amount must be positive');
  });

  it('crearBono should throw an exception for an invalid user role', async () => {
    const bonus: BonusEntity = {
      id: '',
      amount: faker.number.int({ min: 1 }),
      rating: faker.number.float({ min: 0, max: 5, fractionDigits: 2 }),
      keyword: faker.lorem.word(),
      course: null,
      user: null,
    };

    user.role = 'dean';
    await userRepository.save(user);

    await expect(() =>
      service.crearBono(bonus, user.id),
    ).rejects.toHaveProperty(
      'message',
      'The user associated with the bonus must be a professor',
    );
  });

  it('deleteBono should remove a bonus', async () => {
    const bonus: BonusEntity = bonusesList[0];
    bonus.rating = 3.9;
    await repository.save(bonus);
    await service.deleteBono(bonus.id);

    const deletedBonus: BonusEntity = await repository.findOne({
      where: { id: bonus.id },
    });
    expect(deletedBonus).toBeNull();
  });

  it('deleteBono should throw an exception for an invalid bonus', async () => {
    await expect(() =>
      service.deleteBono('0000-0000-0000-0000'),
    ).rejects.toHaveProperty(
      'message',
      'The bonus with the given id was not found',
    );
  });

  it('deleteBono should throw an exception for a bonus with rating above 4', async () => {
    const bonus: BonusEntity = bonusesList[0];
    bonus.rating = 4.1;
    await repository.save(bonus);

    await expect(() => service.deleteBono(bonus.id)).rejects.toHaveProperty(
      'message',
      'The bonus has rating above 4.0',
    );
  });
});
