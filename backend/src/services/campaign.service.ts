import { Injectable } from '@nestjs/common';
import { BpmCampaignDto } from '../dtos/bpmCampaign.dto';
import { Campaign } from '../entities/campaign.entity';
import { AuditRepository } from '../repositories/audit.repository';
import { CampaignRepository } from '../repositories/campaign.repository';
import { BpmService } from './bpm.service';

@Injectable()
export class CampaignService {
  constructor(
    private readonly bpmService: BpmService,
    private readonly campaignRepo: CampaignRepository,
    private readonly auditRepo: AuditRepository,
  ) {}

  async launchCampaign(campaign: Campaign): Promise<string> {
    const bpmPayload: BpmCampaignDto = {
      id: campaign.id,
      deadline: campaign.deadline.toISOString(),
      participants: campaign.participants.map((p) => ({
        id: p.id,
        email: p.email,
      })),
      reminderDaysBefore: campaign.reminderDaysBefore,
      maxRetries: campaign.maxRetries,
      retryIntervalDays: campaign.retryIntervalDays,
    };

    try {
      const campaignId = await this.bpmService.launchCampaign(bpmPayload);

      // Audit successful launch
      await this.auditRepo.logOperation('CAMPAIGN_LAUNCH', bpmPayload, {
        campaignId,
        status: 'SUCCESS',
      });

      // Log campaign launch in repository
      await this.campaignRepo.logLaunch(campaign.id);

      return campaignId;
    } catch (error) {
      // Audit failed launch
      await this.auditRepo.logOperation('CAMPAIGN_LAUNCH_ERROR', bpmPayload, {
        error: error.message,
        stack: error.stack,
        status: 'FAILED',
      });

      throw new Error(`Campaign launch failed: ${error.message}`);
    }
  }

  async getCampaignStatus(campaignId: string): Promise<string> {
    return await this.bpmService.getCampaignStatus(campaignId);
  }

  async syncWithBpmEngine(campaignId: string): Promise<void> {
    const status = await this.bpmService.getCampaignStatus(campaignId);
    await this.campaignRepo.update(campaignId, {
      status,
      lastSync: new Date(),
    });
  }
}
