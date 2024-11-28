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
import { CreateProfessorDto, UpdateProfessorDto } from './professor.dto';
import { ProfessorEntity } from './professor.entity';
import { ProfessorService } from './professor.service';

@Controller('professors')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  @Get()
  async findAll() {
    return await this.professorService.findAll();
  }

  @Get(':professorId')
  async findOne(@Param('professorId') professorId: string) {
    return await this.professorService.findOne(professorId);
  }

  @Post()
  async create(@Body() createProfessorDto: CreateProfessorDto) {
    const professorEntity = plainToInstance(
      ProfessorEntity,
      createProfessorDto,
    );
    return await this.professorService.create(professorEntity);
  }

  @Put(':professorId')
  async update(
    @Param('professorId') professorId: string,
    @Body() updateProfessorDto: UpdateProfessorDto,
  ) {
    const professor: ProfessorEntity = plainToInstance(
      ProfessorEntity,
      updateProfessorDto,
    );
    return await this.professorService.update(professorId, professor);
  }

  @Delete(':professorId')
  @HttpCode(204)
  async delete(@Param('professorId') professorId: string) {
    return await this.professorService.delete(professorId);
  }
}
