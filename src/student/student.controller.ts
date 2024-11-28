import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { CreateStudentDto, UpdateStudentDto } from './student.dto';
import { StudentEntity } from './student.entity';
import { StudentService } from './student.service';

@Controller('students')
@UseInterceptors(BusinessErrorsInterceptor)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async findAll() {
    return await this.studentService.findAll();
  }

  @Get(':studentId')
  async findOne(@Param('studentId') studentId: string) {
    return await this.studentService.findEstudianteById(studentId);
  }

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    const studentEntity = plainToInstance(StudentEntity, createStudentDto);
    return await this.studentService.create(studentEntity);
  }

  @Put(':studentId')
  async update(
    @Param('studentId') studentId: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    const student: StudentEntity = plainToInstance(
      StudentEntity,
      updateStudentDto,
    );
    return await this.studentService.update(studentId, student);
  }

  @Delete(':studentId')
  @HttpCode(204)
  async delete(@Param('studentId') studentId: string) {
    return await this.studentService.delete(studentId);
  }
}
