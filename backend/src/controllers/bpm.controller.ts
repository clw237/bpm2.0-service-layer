import { Body, Controller, Post } from '@nestjs/common';
import {
  BpmInactiveDto,
  BpmReminderDto,
  BpmSummaryDto,
} from '../dtos/webhook.dto';
import { WebhookService } from '../services/webhook.service';

@Controller('bpm-webhooks')
export class BpmController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('reminder')
  handleReminder(@Body() payload: BpmReminderDto) {
    this.webhookService.processReminder(payload);
  }

  @Post('participant-inactive')
  async handleInactivation(@Body() payload: BpmInactiveDto) {
    await this.webhookService.processParticipantInactivation(payload);
  }

  @Post('campaign-summary')
  async handleSummary(@Body() payload: BpmSummaryDto) {
    await this.webhookService.processCampaignSummary(payload);
  }
}
