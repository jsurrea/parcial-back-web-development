import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  endDate: Date;

  @IsNotEmpty()
  @IsUrl()
  url: string;
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
