import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from 'src/entities';
import { Repository } from 'typeorm';

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
    return campaign ?? undefined; // Ensures undefined, not null
  }

  async findActiveCampaigns(): Promise<Campaign[]> {
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

  async update(
    id: string,
    partial: Partial<Campaign>,
  ): Promise<Campaign | undefined> {
    await this.campaignRepository.update(id, partial);
    return this.findById(id);
  }

  async findByInstanceId(instanceId: string): Promise<Campaign | undefined> {
    const campaign = await this.campaignRepository.findOne({
      where: {
        bpmWorkflowInstanceId: instanceId,
      },
    });
    return campaign ?? undefined; // Convert null to undefined
  }

  async findByCampaignId(
    campaignId: string,
    relations?: string[],
  ): Promise<Campaign | undefined> {
    const campaign = await this.campaignRepository.findOne({
      where: { id: campaignId },
      relations: relations ?? [],
    });
    return campaign ?? undefined; // Ensures undefined, not null
  }
}
