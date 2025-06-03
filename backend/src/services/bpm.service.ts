import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { BpmCampaignDto } from '../dtos/bpmCampaign.dto';
import { APIError } from '../types/errors';

@Injectable()
export class BpmService {
  private readonly client: Axios.AxiosInstance;

  constructor(private configService: ConfigService) {
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
}
