import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export default class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private httpService: HttpService) {}

  async sendAssessmentReminder(data: {
    campaignId: string;
    participantId: string;
    email: string;
    missingAssessments: string[];
    attempt: number;
  }) {
    const MAX_RETRIES = 3;
    let attempts = 0;
    while (attempts < MAX_RETRIES) {
      try {
        await this.httpService.axiosRef.post(
          'https://kfone-api/notifications',
          {
            type: 'assessment_reminder',
            payload: {
              campaignId: data.campaignId,
              participantId: data.participantId,
              email: data.email,
              missingAssessments: data.missingAssessments,
              attempt: data.attempt,
            },
          },
        );
        this.logger.log(
          `Sent assessment reminder (attempt ${data.attempt}) for participant ${data.participantId} in campaign ${data.campaignId}`,
        );
        break;
      } catch (error) {
        attempts++;
        if (attempts === MAX_RETRIES) {
          this.logger.error(
            `Failed to send assessment reminder for participant ${data.participantId} in campaign ${data.campaignId}: ${error.message}`,
          );
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
      }
    }
  }
}
