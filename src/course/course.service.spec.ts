import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CourseEntity } from './course.entity';
import { CourseService } from './course.service';

import { faker } from '@faker-js/faker';

describe(CourseService, () => {
  let service: CourseService;
  let repository: Repository<CourseEntity>;
  let coursesList: CourseEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CourseService],
    }).compile();

    service = module.get<CourseService>(CourseService);
    repository = module.get<Repository<CourseEntity>>(
      getRepositoryToken(CourseEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    coursesList = [];
    for (let i = 0; i < 5; i++) {
      const course: CourseEntity = await repository.save({
        name: faker.lorem.words(),
        code: faker.lorem.word({ length: 10 }),
        credits: faker.number.int({ min: 1, max: 10 }),
      });
      coursesList.push(course);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findClaseById should return a course by id', async () => {
    const storedCourse: CourseEntity = coursesList[0];
    const course: CourseEntity = await service.findClaseById(storedCourse.id);
    expect(course).not.toBeNull();
    expect(course.name).toEqual(storedCourse.name);
    expect(course.code).toEqual(storedCourse.code);
    expect(course.credits).toEqual(storedCourse.credits);
  });

  it('findClaseById should throw an exception for an invalid course', async () => {
    await expect(() =>
      service.findClaseById('0000-0000-0000-0000'),
    ).rejects.toHaveProperty(
      'message',
      'The course with the given id was not found',
    );
  });

  it('crearClase should return a new course', async () => {
    const course: CourseEntity = {
      id: '',
      name: faker.lorem.words(),
      code: faker.lorem.word({ length: 10 }),
      credits: faker.number.int({ min: 1, max: 10 }),
      bonuses: [],
      user: null,
    };

    const newCourse: CourseEntity = await service.crearClase(course);
    expect(newCourse).not.toBeNull();

    const storedCourse: CourseEntity = await repository.findOne({
      where: { id: newCourse.id },
    });
    expect(storedCourse).not.toBeNull();
    expect(storedCourse.name).toEqual(course.name);
    expect(storedCourse.code).toEqual(course.code);
    expect(storedCourse.credits).toEqual(course.credits);
  });

  it('crearClase should throw an exception for an invalid code', async () => {
    const course: CourseEntity = {
      id: '',
      name: faker.lorem.words(),
      code: faker.lorem.word({ length: 5 }),
      credits: faker.number.int({ min: 1, max: 10 }),
      bonuses: [],
      user: null,
    };

    await expect(() => service.crearClase(course)).rejects.toHaveProperty(
      'message',
      'The course code must be 10 characters long',
    );
  });
});
