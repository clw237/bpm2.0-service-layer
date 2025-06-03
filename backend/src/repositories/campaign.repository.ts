// repositories/campaign.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from '../entities/campaign.entity';

@Injectable()
export class CampaignRepository {
  constructor(
    @InjectRepository(Campaign)
    private readonly repo: Repository<Campaign>,
  ) {}

  findActiveCampaigns(): Promise<Campaign[]> {
    return this.repo
      .createQueryBuilder('campaign')
      .where('campaign.deadline > :now', { now: new Date() })
      .andWhere('campaign.status = :status', { status: 'ACTIVE' })
      .getMany();
  }

  async logLaunch(campaignId: string): Promise<void> {
    await this.repo.query(
      `INSERT INTO campaign_audit_log 
       (campaign_id, launched_at) 
       VALUES ($1, NOW())`,
      [campaignId],
    );
  }

  async update(id: string, partial: Partial<Campaign>): Promise<void> {
    await this.repo.update(id, partial);
  }
}
