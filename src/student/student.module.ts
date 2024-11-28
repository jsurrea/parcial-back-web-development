import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentEntity } from './student.entity';
import { StudentController } from './student.controller';

@Module({
  providers: [StudentService],
  imports: [TypeOrmModule.forFeature([StudentEntity])],
  controllers: [StudentController],
})
export class StudentModule {}
