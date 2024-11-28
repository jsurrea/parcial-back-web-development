import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProposalEntity } from './proposal.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(ProposalEntity)
    private readonly proposalRepository: Repository<ProposalEntity>,
  ) {}

  async findAllPropuesta(): Promise<ProposalEntity[]> {
    return await this.proposalRepository.find({
      relations: ['project', 'professor'],
    });
  }

  async findPropuestaById(id: string): Promise<ProposalEntity> {
    const proposal: ProposalEntity = await this.proposalRepository.findOne({
      where: { id },
      relations: ['project', 'professor'],
    });
    if (!proposal)
      throw new BusinessLogicException(
        'The proposal with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return proposal;
  }

  async create(proposal: ProposalEntity): Promise<ProposalEntity> {
    if (!proposal.title) {
      throw new BusinessLogicException(
        'The proposal title is required',
        BusinessError.INVALID_DATA,
      );
    }
    return await this.proposalRepository.save(proposal);
  }

  async update(id: string, proposal: ProposalEntity): Promise<ProposalEntity> {
    const persistedProposal: ProposalEntity =
      await this.proposalRepository.findOne({
        where: { id },
      });
    if (!persistedProposal)
      throw new BusinessLogicException(
        'The proposal with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.proposalRepository.save({
      ...persistedProposal,
      ...proposal,
    });
  }

  async deletePropuesta(id: string) {
    const proposal: ProposalEntity = await this.proposalRepository.findOne({
      where: { id },
    });
    if (!proposal)
      throw new BusinessLogicException(
        'The proposal with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    if (proposal.project) {
      throw new BusinessLogicException(
        'The proposal has a project assigned',
        BusinessError.INVALID_DATA,
      );
    }

    await this.proposalRepository.remove(proposal);
  }
}
