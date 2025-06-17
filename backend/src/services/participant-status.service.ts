import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import {
  ParticipantCompletedEventDto,
  RaterAssessmentCompletedEventDto,
} from '../dtos/kfone-event.dto';

@Injectable()
export class ParticipantStatusService {
  private readonly logger = new Logger(ParticipantStatusService.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * Updates Decisions BPM when a participant completes an assessment.
   * Expects event to include:
   * - campaignId
   * - participantId
   * - assessment
   * - status
   * - timestamp
   */
  async updateParticipantAssessment(
    event: ParticipantCompletedEventDto,
  ): Promise<void> {
    const payload = {
      campaignId: event.campaignId,
      participantId: event.participantId,
      assessment: event.assessment,
      status: event.status,
      timestamp: event.timestamp,
    };
    this.logger.log(
      `Participant ${payload.participantId} completed assessment ${payload.assessment} for campaign ${payload.campaignId}`,
    );
    await firstValueFrom(
      this.httpService.post(
        `${process.env.DECISIONS_BPM_URL}/correlate/${payload.campaignId}/assessment`,
        payload,
      ),
    );
  }

  /**
   * Updates Decisions BPM when a rater completes an assessment.
   * Expects event to include:
   * - campaignId
   * - raterId
   * - assessment
   * - status
   * - timestamp
   */
  async updateRaterAssessment(
    event: RaterAssessmentCompletedEventDto,
  ): Promise<void> {
    const payload = {
      campaignId: event.campaignId,
      raterId: event.raterId,
      assessment: event.assessment,
      status: event.status,
      timestamp: event.timestamp,
    };
    this.logger.log(
      `Rater ${payload.raterId} completed assessment ${payload.assessment} for campaign ${payload.campaignId}`,
    );
    await firstValueFrom(
      this.httpService.post(
        `${process.env.DECISIONS_BPM_URL}/correlate/${payload.campaignId}/rater-assessment`,
        payload,
      ),
    );
  }
}
