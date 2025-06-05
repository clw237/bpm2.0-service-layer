import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Campaign } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export default class ParticipantStatusService {
  private readonly logger = new Logger(ParticipantStatusService.name);

  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
    private httpService: HttpService,
  ) {}

  async updateAssessmentStatus(
    campaignId: string,
    participantId: string,
    assessment: string,
    status: 'completed' | 'pending',
  ) {
    try {
      const campaign = await this.campaignRepository.findOneBy({
        id: campaignId,
      });

      if (!campaign?.bpmWorkflowInstanceId) {
        throw new Error(`No BPM instance found for campaign ${campaignId}`);
      }

      // Construct Decisions BPM API payload
      const bpmPayload = {
        instanceId: campaign.bpmWorkflowInstanceId,
        participantId,
        variableUpdates: {
          [assessment.toLowerCase()]: status.toUpperCase(),
        },
      };

      // Update BPM workflow instance data
      const response = await firstValueFrom(
        this.httpService.post(
          `/decisions/api/instance/${campaign.bpmWorkflowInstanceId}/variables`,
          bpmPayload,
          {
            headers: {
              'Content-Type': 'application/vnd.bpm.api+json',
              Authorization: `Bearer ${process.env.DECISIONS_BPM_TOKEN}`,
            },
          },
        ),
      );

      this.logger.log(
        `Updated ${assessment} status for participant ${participantId} in campaign ${campaignId}`,
      );
      return {
        success: true,
        instanceId: campaign.bpmWorkflowInstanceId,
        sequenceNumber: response.data.sequenceNumber,
      };
    } catch (error) {
      this.logger.error(
        `Status update failed for campaign ${campaignId}: ${error.message}`,
      );
      throw error;
    }
  }
}
