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
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import { ProjectEntity } from './project.entity';
import { ProjectService } from './project.service';

@Controller('projects')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async findAll() {
    return await this.projectService.findAll();
  }

  @Get(':projectId')
  async findOne(@Param('projectId') projectId: string) {
    return await this.projectService.findOne(projectId);
  }

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    const projectEntity = plainToInstance(ProjectEntity, createProjectDto);
    return await this.projectService.create(projectEntity);
  }

  @Put(':projectId')
  async update(
    @Param('projectId') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const project: ProjectEntity = plainToInstance(
      ProjectEntity,
      updateProjectDto,
    );
    return await this.projectService.update(projectId, project);
  }

  @Delete(':projectId')
  @HttpCode(204)
  async delete(@Param('projectId') projectId: string) {
    return await this.projectService.delete(projectId);
  }
}
