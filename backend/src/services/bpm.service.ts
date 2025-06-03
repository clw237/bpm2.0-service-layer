import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AuditRepository } from 'src/repositories/audit.repository';
import { BpmCampaignDto } from '../dtos/bpmCampaign.dto';
import { APIError } from '../types/errors';

@Injectable()
export class BpmService {
  private readonly client: Axios.AxiosInstance;

  constructor(
    private configService: ConfigService,
    private auditRepo: AuditRepository,
  ) {
    /*
    ---Best Practice Violations---
    Hardcoded timeout values without circuit breakers
    No request/response logging to PostgreSQL
    Missing idempotency keys for retry-able operations
    */
    this.client = axios.create({
      baseURL: this.configService.get<string>('bpm.url'),
      timeout: 5000,
      headers: {
        'X-API-Key': this.configService.get<string>('bpm.apiKey'),
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

  async launchCampaign(payload: BpmCampaignDto): Promise<string> {
    const response = await this.client.post<{ campaignId: string }>(
      '/campaigns',
      payload,
    );
    return response.data.campaignId; // Now type-safe
  }

  async getCampaignStatus(campaignId: string): Promise<string> {
    const response = await this.client.get<{ status: string }>(
      `/campaigns/${campaignId}/status`,
    );
    return response.data.status;
  }
}
