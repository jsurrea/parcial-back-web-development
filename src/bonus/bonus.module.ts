import { Module } from '@nestjs/common';
import { BonusService } from './bonus.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonusEntity } from './bonus.entity';
import { BonusController } from './bonus.controller';
import { CourseService } from 'src/course/course.service';
import { UserService } from 'src/user/user.service';
import { CourseEntity } from 'src/course/course.entity';
import { UserEntity } from 'src/user/user.entity';

@Module({
  providers: [BonusService, CourseService, UserService],
  imports: [TypeOrmModule.forFeature([BonusEntity, CourseEntity, UserEntity])],
  controllers: [BonusController],
})
export class BonusModule {}
