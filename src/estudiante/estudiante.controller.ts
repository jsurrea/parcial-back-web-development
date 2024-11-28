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
import { CreateEstudianteDto, UpdateEstudianteDto } from './estudiante.dto';
import { EstudianteEntity } from './estudiante.entity';
import { EstudianteService } from './estudiante.service';

@Controller('estudiantes')
@UseInterceptors(BusinessErrorsInterceptor)
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Get()
  async findAll() {
    return await this.estudianteService.findAll();
  }

  @Get(':estudianteId')
  async findOne(@Param('estudianteId') estudianteId: string) {
    return await this.estudianteService.findOne(estudianteId);
  }

  @Post()
  async create(@Body() createEstudianteDto: CreateEstudianteDto) {
    const estudianteEntity = plainToInstance(
      EstudianteEntity,
      createEstudianteDto,
    );
    return await this.estudianteService.create(estudianteEntity);
  }

  @Put(':estudianteId')
  async update(
    @Param('estudianteId') estudianteId: string,
    @Body() updateEstudianteDto: UpdateEstudianteDto,
  ) {
    const estudiante: EstudianteEntity = plainToInstance(
      EstudianteEntity,
      updateEstudianteDto,
    );
    return await this.estudianteService.update(estudianteId, estudiante);
  }

  @Delete(':estudianteId')
  @HttpCode(204)
  async delete(@Param('estudianteId') estudianteId: string) {
    return await this.estudianteService.delete(estudianteId);
  }
}
