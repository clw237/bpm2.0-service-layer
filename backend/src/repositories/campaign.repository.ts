import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from '../entities';

@Injectable()
export default class CampaignRepository {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
  ) {}

  /**
   * Find a campaign by ID, optionally loading relations.
   * @param id Campaign ID
   * @param relations Optional array of relation names to load
   */
  async findById(
    id: string,
    relations?: string[],
  ): Promise<Campaign | undefined> {
    const campaign = await this.campaignRepository.findOne({
      where: { id },
      relations: relations ?? [],
    });
    return campaign ?? undefined;
  }

  findActiveCampaigns(): Promise<Campaign[]> {
    return this.campaignRepository
      .createQueryBuilder('campaign')
      .where('campaign.deadline > :now', { now: new Date() })
      .andWhere('campaign.status = :status', { status: 'ACTIVE' })
      .getMany();
  }

  async logLaunch(campaignId: string): Promise<void> {
    await this.campaignRepository.query(
      `INSERT INTO campaign_audit_log 
       (campaign_id, launched_at) 
       VALUES ($1, NOW())`,
      [campaignId],
    );
  }

  async update(id: string, partial: Partial<Campaign>): Promise<void> {
    await this.campaignRepository.update(id, partial);
  }
}
