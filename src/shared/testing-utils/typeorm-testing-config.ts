import { TypeOrmModule } from '@nestjs/typeorm';
import { BonusEntity } from '../../bonus/bonus.entity';
import { UserEntity } from '../../user/user.entity';
import { CourseEntity } from '../../course/course.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [BonusEntity, CourseEntity, UserEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([BonusEntity, CourseEntity, UserEntity]),
];
