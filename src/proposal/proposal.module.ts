import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalEntity } from './proposal.entity';
import { ProposalController } from './proposal.controller';

@Module({
  providers: [ProposalService],
  imports: [TypeOrmModule.forFeature([ProposalEntity])],
  controllers: [ProposalController],
})
export class ProposalModule {}
