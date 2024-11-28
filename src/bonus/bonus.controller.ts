import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { CreateBonusDto } from './bonus.dto';
import { BonusEntity } from './bonus.entity';
import { BonusService } from './bonus.service';

@Controller('bonuses')
@UseInterceptors(BusinessErrorsInterceptor)
export class BonusController {
  constructor(private readonly bonusService: BonusService) {}

  @Get(':userId')
  async findAllBonosByUsuario(@Param('userId') userId: string) {
    return await this.bonusService.findAllBonosByUsuario(userId);
  }

  @Get(':cod')
  async findBonosByCodigo(@Param('cod') cod: string) {
    return await this.bonusService.findBonosByCodigo(cod);
  }

  @Post()
  async crearBono(@Body() createBonusDto: CreateBonusDto) {
    const bonusEntity = plainToInstance(BonusEntity, createBonusDto);
    return await this.bonusService.crearBono(bonusEntity);
  }

  @Delete(':bonusId')
  @HttpCode(204)
  async deleteBono(@Param('bonusId') bonusId: string) {
    return await this.bonusService.deleteBono(bonusId);
  }
}
