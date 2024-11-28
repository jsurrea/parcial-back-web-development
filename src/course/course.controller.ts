import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { CreateCourseDto } from './course.dto';
import { CourseEntity } from './course.entity';
import { CourseService } from './course.service';

@Controller('courses')
@UseInterceptors(BusinessErrorsInterceptor)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get(':courseId')
  async findClaseById(@Param('courseId') courseId: string) {
    return await this.courseService.findClaseById(courseId);
  }

  @Post()
  async crearClase(@Body() createCourseDto: CreateCourseDto) {
    const courseEntity = plainToInstance(CourseEntity, createCourseDto);
    return await this.courseService.crearClase(courseEntity);
  }
}
