import { Injectable, Logger } from '@nestjs/common';
import { BpmReminderDto } from '../dtos/webhook.dto';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  // Option 1: Remove "async"
  processReminder(payload: BpmReminderDto): void {
    this.logger.log(
      `Processing reminder for participant ${payload.participantId} in campaign ${payload.campaignId}`,
    );
  }

  // Option 2: Add dummy await
  async processParticipantInactivation(payload: any): Promise<void> {
    this.logger.log(
      `Processing inactivation for participant ${payload.participantId}`,
    );
    await Promise.resolve(); // If async needed later
  }

  async processCampaignSummary(payload: any): Promise<void> {
    this.logger.log(
      `Processing campaign summary for campaign ${payload.campaignId}`,
    );
    await Promise.resolve(); // If async needed later
  }
}
