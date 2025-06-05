import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class NotificationService {
  constructor(private httpService: HttpService) {}

  async sendReminder(data: {
    campaignId: string;
    participantId: string;
    missingAssessments: string[];
  }) {
    await this.httpService.axiosRef.post('https://kfone-api/notifications', {
      type: 'assessment_reminder',
      payload: data,
    });
  }
}
