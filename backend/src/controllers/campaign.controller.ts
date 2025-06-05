import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  CampaignUpdateDto,
  CreateCampaignDto,
  ParticipantStatusUpdateDto,
} from 'src/dtos';
import { CampaignService, ParticipantStatusService } from 'src/services';

@Controller('api/campaigns')
export default class CampaignController {
  private readonly logger = new Logger(CampaignController.name);

  constructor(
    private readonly campaignService: CampaignService,
    private readonly statusService: ParticipantStatusService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAndLaunchCampaign(@Body() campaignData: CreateCampaignDto) {
    try {
      this.logger.log(`Launching new campaign: ${campaignData.name}`);
      const workflowId =
        await this.campaignService.launchCampaign(campaignData);
      return {
        campaignId: campaignData.id,
        bpmWorkflowId: workflowId,
        status: 'ACTIVE',
      };
    } catch (error) {
      this.logger.error(`Campaign launch failed: ${error.message}`);
      throw error;
    }
  }

  @Put(':campaignId/participants')
  @HttpCode(HttpStatus.OK)
  async updateCampaignParticipants(
    @Param('campaignId') campaignId: string,
    @Body() updateData: CampaignUpdateDto,
  ) {
    try {
      this.logger.log(`Updating participants for campaign ${campaignId}`);
      await this.campaignService.updateParticipants(
        campaignId,
        updateData.participantIds,
      );
      return {
        campaignId,
        updatedParticipants: updateData.participantIds.length,
      };
    } catch (error) {
      this.logger.error(`Participant update failed: ${error.message}`);
      throw error;
    }
  }

  @Post(':campaignId/participants/:participantId/status')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateAssessmentStatus(
    @Param('campaignId') campaignId: string,
    @Param('participantId') participantId: string,
    @Body() statusUpdate: ParticipantStatusUpdateDto,
  ) {
    try {
      this.logger.log(`Updating status for ${participantId} in ${campaignId}`);
      await this.statusService.updateAssessmentStatus(
        campaignId,
        participantId,
        statusUpdate.assessment,
        statusUpdate.status as 'completed' | 'pending',
      );
      return {
        campaignId,
        participantId,
        assessment: statusUpdate.assessment,
        status: 'RECEIVED',
      };
    } catch (error) {
      this.logger.error(`Status update failed: ${error.message}`);
      throw error;
    }
  }
}
