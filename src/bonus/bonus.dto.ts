import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBonusDto {
  @IsNotEmpty()
  @IsInt()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsNotEmpty()
  @IsString()
  keyword: string;
}

export class UpdateBonusDto extends PartialType(CreateBonusDto) {}
