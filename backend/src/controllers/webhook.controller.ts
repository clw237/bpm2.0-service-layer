import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { ReminderDto } from 'src/dtos';
import { AppConfigService, NotificationService } from 'src/services';

@Controller('webhooks')
export default class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private notificationService: NotificationService,
    private configService: AppConfigService,
  ) {}

  @Post('reminder')
  @HttpCode(HttpStatus.OK)
  async handleReminder(
    @Body() payload: ReminderDto,
    @Headers('x-bpm-signature') signature: string,
  ) {
    try {
      this.verifyWebhookSignature(JSON.stringify(payload), signature);

      this.logger.log(
        `Received reminder for participant ${payload.participantId} in campaign ${payload.campaignId} (Attempt ${payload.attempt})`,
      );

      await this.notificationService.sendAssessmentReminder({
        campaignId: payload.campaignId,
        participantId: payload.participantId,
        email: payload.email,
        missingAssessments: payload.missingAssessments,
        attempt: payload.attempt,
      });

      return { status: 'processed' };
    } catch (error) {
      this.logger.error(`Reminder processing failed: ${error.message}`);
      throw error;
    }
  }

  private verifyWebhookSignature(payload: string, signature: string): void {
    const secret = this.configService.getConfigValue('WEBHOOK_SECRET');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    if (signature !== `sha256=${expectedSignature}`) {
      this.logger.warn('Invalid webhook signature detected');
      throw new UnauthorizedException('Invalid webhook signature');
    }
  }
}
