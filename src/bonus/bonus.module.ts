import { Module } from '@nestjs/common';
import { BonusService } from './bonus.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonusEntity } from './bonus.entity';
import { BonusController } from './bonus.controller';

@Module({
  providers: [BonusService],
  imports: [TypeOrmModule.forFeature([BonusEntity])],
  controllers: [BonusController],
})
export class BonusModule {}
