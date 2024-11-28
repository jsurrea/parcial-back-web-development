import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './project.entity';
import { ProjectController } from './project.controller';

@Module({
  providers: [ProjectService],
  imports: [TypeOrmModule.forFeature([ProjectEntity])],
  controllers: [ProjectController],
})
export class ProjectModule {}
