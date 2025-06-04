import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { Injectable } from '@nestjs/common';
import { CampaignDto } from 'src/dtos';
import { Campaign } from 'src/entities';
import { CampaignRepository, LogRepository } from 'src/repositories';
import { APIError } from 'src/types/errors';

@Injectable()
export default class CampaignIntegrationService {
  private readonly client: Axios.AxiosInstance;

  constructor(
    private readonly configService: ConfigService,
    private readonly campaignRepository: CampaignRepository,
    private readonly logRepository: LogRepository,
  ) {
    this.client = axios.create({
      baseURL: this.configService.get('bpm.url'),
      timeout: 5000,
      headers: {
        'X-API-Key': this.configService.get('bpm.apiKey'),
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        throw new APIError(
          error.response?.status ?? 503,
          'BPM 2.0 Layer connection failed',
          error.response?.data,
        );
      },
    );
  }

  async launchCampaign(campaign: Campaign): Promise<string> {
    const payload: CampaignDto = {
      id: campaign.id,
      deadline: campaign.deadline.toISOString(),
      participants: campaign.participants.map((p) => ({
        email: p.email,
        username: p.username,
      })),
      reminderDaysBefore: campaign.reminderDaysBefore,
      assessments: campaign.assessments,
      status: campaign.status,
    };

    try {
      const response = await this.client.post<{ campaignId: string }>(
        '/campaigns',
        payload,
      );
      const campaignId = response.data.campaignId;

      await this.logRepository.logOperation('info', 'CAMPAIGN_LAUNCH', {
        payload,
        result: { campaignId, status: 'SUCCESS' },
      });

      await this.campaignRepository.logLaunch(campaign.id);
      return campaignId;
    } catch (error) {
      await this.logRepository.logOperation('error', 'CAMPAIGN_LAUNCH_ERROR', {
        payload,
        error: {
          message: error.message,
          stack: error.stack,
          status: 'FAILED',
        },
      });

      throw new Error(`Campaign launch failed: ${error.message}`);
    }
  }

  async getCampaignStatus(campaignId: string): Promise<string> {
    const response = await this.client.get<{ status: string }>(
      `/campaigns/${campaignId}/status`,
    );
    return response.data.status;
  }

  async syncWithBpmEngine(campaignId: string): Promise<void> {
    const status = await this.getCampaignStatus(campaignId);
    await this.campaignRepository.update(campaignId, {
      status,
      lastSync: new Date(),
    });
  }
}
