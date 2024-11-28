import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from './course.entity';
import { CourseController } from './course.controller';

@Module({
  providers: [CourseService],
  imports: [TypeOrmModule.forFeature([CourseEntity])],
  controllers: [CourseController],
})
export class CourseModule {}
