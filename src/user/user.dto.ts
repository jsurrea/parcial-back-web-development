import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
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

  @IsNotEmpty()
  @IsString()
  @IsIn(['professor', 'dean'])
  readonly role: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
