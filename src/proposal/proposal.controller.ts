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
import { CreateProposalDto, UpdateProposalDto } from './proposal.dto';
import { ProposalEntity } from './proposal.entity';
import { ProposalService } from './proposal.service';

@Controller('proposals')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Get()
  async findAll() {
    return await this.proposalService.findAll();
  }

  @Get(':proposalId')
  async findOne(@Param('proposalId') proposalId: string) {
    return await this.proposalService.findOne(proposalId);
  }

  @Post()
  async create(@Body() createProposalDto: CreateProposalDto) {
    const proposalEntity = plainToInstance(ProposalEntity, createProposalDto);
    return await this.proposalService.create(proposalEntity);
  }

  @Put(':proposalId')
  async update(
    @Param('proposalId') proposalId: string,
    @Body() updateProposalDto: UpdateProposalDto,
  ) {
    const proposal: ProposalEntity = plainToInstance(
      ProposalEntity,
      updateProposalDto,
    );
    return await this.proposalService.update(proposalId, proposal);
  }

  @Delete(':proposalId')
  @HttpCode(204)
  async delete(@Param('proposalId') proposalId: string) {
    return await this.proposalService.delete(proposalId);
  }
}
