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
import { CreateUserDto } from './user.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
@UseInterceptors(BusinessErrorsInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  async findUsuarioById(@Param('userId') userId: string) {
    return await this.userService.findUsuarioById(userId);
  }

  @Post()
  async crearUsuario(@Body() createUserDto: CreateUserDto) {
    const userEntity = plainToInstance(UserEntity, createUserDto);
    return await this.userService.crearUsuario(userEntity);
  }

  @Delete(':userId')
  @HttpCode(204)
  async eliminarUsuario(@Param('userId') userId: string) {
    return await this.userService.eliminarUsuario(userId);
  }
}
