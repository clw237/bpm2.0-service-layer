import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import {
  CampaignLaunchedEventDto,
  ParticipantsAddedEventDto,
} from '../dtos/kfone-event.dto';

@Injectable()
export default class CampaignService {
  private readonly logger = new Logger(CampaignService.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * Launches a new campaign workflow in Decisions BPM.
   * Expects event to include:
   * - campaignId (businessKey)
   * - workflowTemplateId
   * - deadline
   * - participants: array of { participantId, email }
   */
  async launchCampaignWorkflow(event: CampaignLaunchedEventDto) {
    const payload = {
      businessKey: event.campaignId,
      workflowTemplateId: event.workflowTemplateId,
      deadline: event.deadline,
      participants: event.participants,
    };
    this.logger.log(`Launching campaign in BPM: ${JSON.stringify(payload)}`);
    await firstValueFrom(
      this.httpService.post(
        `${process.env.DECISIONS_BPM_URL}/flow/launch/${payload.workflowTemplateId}`,
        payload,
      ),
    );
  }

  /**
   * Add participants to an existing campaign in Decisions BPM.
   * Expects event to include:
   * - campaignId
   * - participants: array of { participantId, email }
   */
  async addParticipants(event: ParticipantsAddedEventDto): Promise<void> {
    const payload = {
      campaignId: event.campaignId,
      participants: event.participants,
    };
    this.logger.log(
      `Adding participants to campaign ${payload.campaignId}: ${JSON.stringify(payload.participants)}`,
    );
    await firstValueFrom(
      this.httpService.post(
        `${process.env.DECISIONS_BPM_URL}/correlate/${payload.campaignId}/participants`,
        payload,
      ),
    );
  }
}
