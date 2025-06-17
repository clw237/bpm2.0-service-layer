import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import CampaignService from '../services/campaign.service';
import { ParticipantStatusService } from '../services/participant-status.service';

import {
  CampaignLaunchedEventDto,
  ParticipantCompletedEventDto,
  ParticipantsAddedEventDto,
  RaterAssessmentCompletedEventDto,
} from '../dtos/kfone-event.dto';

@Controller()
export default class EventConsumerController {
  private readonly logger = new Logger(EventConsumerController.name);

  constructor(
    private readonly campaignService: CampaignService,
    private readonly participantStatusService: ParticipantStatusService,
  ) {}

  @EventPattern('kfone.events')
  async handleKfoneEvent(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.log(`Received event: ${JSON.stringify(data)}`);
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      switch (data.type) {
        case 'CAMPAIGN_LAUNCHED':
          await this.campaignService.launchCampaignWorkflow(
            data as CampaignLaunchedEventDto,
          );
          break;
        case 'PARTICIPANTS_ADDED':
          await this.campaignService.addParticipants(
            data as ParticipantsAddedEventDto,
          );
          break;
        case 'PARTICIPANT_COMPLETED':
          await this.participantStatusService.updateParticipantAssessment(
            data as ParticipantCompletedEventDto,
          );
          break;
        case 'RATER_ASSESSMENT_COMPLETED':
          await this.participantStatusService.updateRaterAssessment(
            data as RaterAssessmentCompletedEventDto,
          );
          break;
        default:
          this.logger.warn(`Unknown event type: ${data.type}`);
      }
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(`Error processing event: ${error.message}`);
      channel.nack(originalMsg, false, false);
    }
  }
}
