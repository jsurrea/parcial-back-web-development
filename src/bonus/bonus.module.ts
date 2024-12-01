import { Module } from '@nestjs/common';
import { BonusService } from './bonus.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonusEntity } from './bonus.entity';
import { BonusController } from './bonus.controller';
import { CourseService } from '../course/course.service';
import { UserService } from '../user/user.service';
import { CourseEntity } from '../course/course.entity';
import { UserEntity } from '../user/user.entity';

@Module({
  providers: [BonusService, CourseService, UserService],
  imports: [TypeOrmModule.forFeature([BonusEntity, CourseEntity, UserEntity])],
  controllers: [BonusController],
})
export class BonusModule {}
