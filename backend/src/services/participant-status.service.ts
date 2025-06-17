import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ParticipantStatusService {
  private readonly logger = new Logger(ParticipantStatusService.name);

  constructor(private readonly httpService: HttpService) {}

  async updateParticipantAssessment(event: any) {
    const payload = {
      campaignId: event.campaignId,
      participantId: event.participantId,
      assessment: event.assessment,
      status: event.status,
      timestamp: event.timestamp,
    };
    this.logger.log(
      `Updating participant assessment: ${JSON.stringify(payload)}`,
    );
    await firstValueFrom(
      this.httpService.post(
        `${process.env.DECISIONS_BPM_URL}/correlate/${payload.campaignId}/assessment`,
        payload,
      ),
    );
  }

  async updateRaterAssessment(event: any) {
    const payload = {
      campaignId: event.campaignId,
      raterId: event.raterId,
      assessment: event.assessment,
      status: event.status,
      timestamp: event.timestamp,
    };
    this.logger.log(`Updating rater assessment: ${JSON.stringify(payload)}`);
    await firstValueFrom(
      this.httpService.post(
        `${process.env.DECISIONS_BPM_URL}/correlate/${payload.campaignId}/rater-assessment`,
        payload,
      ),
    );
  }
}
