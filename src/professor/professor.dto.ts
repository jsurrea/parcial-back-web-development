import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateProfessorDto {
  @IsNotEmpty()
  @IsInt()
  readonly governmentId: number;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly researchGroup: string;

  @IsNotEmpty()
  @IsInt()
  readonly telephoneExtension: number;
}

export class UpdateProfessorDto extends PartialType(CreateProfessorDto) {}
