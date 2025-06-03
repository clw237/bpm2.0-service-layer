import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import { Request } from 'express';
import {
  BpmInactiveDto,
  BpmReminderDto,
  BpmSummaryDto,
} from '../dtos/webhook.dto';
import { WebhookService } from '../services/webhook.service';

// HMAC Validation Utility (could also be moved to src/utils/security.ts)
function validateSignature(
  receivedSignature: string,
  payload: any,
  secret: string,
): boolean {
  const payloadString = JSON.stringify(payload);
  const expectedSignature = createHmac('sha256', secret)
    .update(payloadString)
    .digest('hex');
  return receivedSignature === expectedSignature;
}

@Controller('bpm-webhooks')
export class BpmController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly configService: ConfigService,
  ) {}

  private validateWebhook(req: Request, payload: any): void {
    const signature = req.headers['x-bpm-signature'] as string;
    const hmacSecret = this.configService.get<string>('BPM_HMAC_SECRET');

    if (!signature || !hmacSecret) {
      throw new UnauthorizedException('Missing security headers');
    }

    if (!validateSignature(signature, payload, hmacSecret)) {
      throw new UnauthorizedException('Invalid signature');
    }
  }

  @Post('reminder')
  handleReminder(@Body() payload: BpmReminderDto, @Req() req: Request) {
    this.validateWebhook(req, payload);
    return this.webhookService.processReminder(payload);
  }

  @Post('participant-inactive')
  async handleInactivation(
    @Body() payload: BpmInactiveDto,
    @Req() req: Request,
  ) {
    this.validateWebhook(req, payload);
    return this.webhookService.processParticipantInactivation(payload);
  }

  @Post('campaign-summary')
  async handleSummary(@Body() payload: BpmSummaryDto, @Req() req: Request) {
    this.validateWebhook(req, payload);
    return this.webhookService.processCampaignSummary(payload);
  }
}
