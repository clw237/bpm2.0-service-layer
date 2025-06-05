import {
  Body,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { AppConfigService, NotificationService } from 'src/services';

@Controller('webhooks')
export default class WebhookController {
  constructor(
    private notificationService: NotificationService,
    private configService: AppConfigService,
  ) {}

  @Post('reminder')
  async handleReminder(
    @Body()
    payload: {
      campaignId: string;
      participantId: string;
      missingAssessments: string[];
    },
    @Headers('x-bpm-signature') signature: string,
  ) {
    this.verifySignature(payload, signature);

    await this.notificationService.sendReminder({
      campaignId: payload.campaignId,
      participantId: payload.participantId,
      missingAssessments: payload.missingAssessments,
    });
  }

  private verifySignature(payload: any, receivedSignature: string) {
    const secret = this.configService.get('BPM_WEBHOOK_SECRET');
    const expectedSignature = crypto
      .createHmac('sha256', secret as string)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (
      !crypto.timingSafeEqual(
        Buffer.from(receivedSignature),
        Buffer.from(expectedSignature),
      )
    ) {
      throw new UnauthorizedException('Invalid signature');
    }
  }
}
