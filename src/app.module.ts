import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonusModule } from './bonus/bonus.module';
import { CourseModule } from './course/course.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    BonusModule,
    CourseModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [BonusModule, CourseModule, UserModule],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
      logging: true,
      autoLoadEntities: true,
    }),
  ],
})
export class AppModule {}
