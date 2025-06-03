import { Injectable } from '@nestjs/common';
import { Campaign } from '../entities/campaign.entity';
import { BpmCampaignDto } from '../interfaces/bpm.interface';
import { BpmClient } from '../modules/bpm/bpmClient';

@Injectable()
export class CampaignService {
  constructor(private readonly bpmClient: BpmClient) {}

  async createCampaign(campaign: Campaign): Promise<string> {
    const bpmPayload = this.mapToBpmDto(campaign);
    return this.bpmClient.launchCampaign(bpmPayload);
  }

  private mapToBpmDto(campaign: Campaign): BpmCampaignDto {
    return {
      id: campaign.id,
      deadline: campaign.deadline.toISOString(),
      participants: campaign.participants.map((p) => ({
        id: p.id,
        email: p.email,
      })),
    };
  }
}
