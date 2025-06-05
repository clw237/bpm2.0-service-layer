import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { CreateCampaignDto } from 'src/dtos';
import { Campaign, User } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export default class CampaignService {
  private readonly logger = new Logger(CampaignService.name);

  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private httpService: HttpService,
  ) {}

  async launchCampaign(dto: CreateCampaignDto): Promise<string> {
    try {
      // Create campaign entity with workflow template reference
      const campaign = this.campaignRepository.create({
        ...dto,
        deadline: new Date(dto.deadline),
        participants: await this.userRepository.findByIds(dto.participantIds),
      });

      const savedCampaign = await this.campaignRepository.save(campaign);

      // Prepare BPM payload with workflow template ID
      const bpmPayload = {
        CampaignId: savedCampaign.id,
        WorkflowTemplateId: dto.workflowTemplateId,
        AssessmentDeadline: savedCampaign.deadline.toISOString(),
        ReminderDaysBefore: savedCampaign.reminderDaysBefore,
        Participants: savedCampaign.participants.map((p) => ({
          ParticipantId: p.id,
          Email: p.email,
          Status: this.createInitialStatus(dto.assessments),
        })),
      };

      // Launch specific workflow template
      const response = await firstValueFrom(
        this.httpService.post(
          `/decisions/api/flow/launch/${dto.workflowTemplateId}`,
          bpmPayload,
        ),
      );

      // Store BPM instance ID
      await this.campaignRepository.update(savedCampaign.id, {
        bpmWorkflowInstanceId: response.data.instanceId,
      });

      this.logger.log(
        `Launched campaign ${savedCampaign.id} with BPM instance ${response.data.instanceId}`,
      );
      return response.data.instanceId;
    } catch (error) {
      this.logger.error(`Campaign launch failed: ${error.message}`);
      throw error;
    }
  }

  async addParticipants(
    campaignId: string,
    participantIds: string[],
  ): Promise<void> {
    try {
      const campaign = await this.campaignRepository.findOneOrFail({
        where: { id: campaignId },
        relations: ['participants'],
      });

      const newParticipants =
        await this.userRepository.findByIds(participantIds);

      // Append new participants (no removal per requirements)
      campaign.participants = [...campaign.participants, ...newParticipants];
      await this.campaignRepository.save(campaign);

      // Update Decisions BPM instance
      await firstValueFrom(
        this.httpService.post(
          `/decisions/api/instance/${campaign.bpmWorkflowInstanceId}/participants`,
          newParticipants.map((p) => ({
            ParticipantId: p.id,
            Email: p.email,
            Status: this.createInitialStatus(campaign.assessments),
          })),
        ),
      );

      this.logger.log(
        `Added ${newParticipants.length} participants to campaign ${campaignId}`,
      );
    } catch (error) {
      this.logger.error(`Failed to add participants: ${error.message}`);
      throw error;
    }
  }

  private createInitialStatus(assessments: string[]): Record<string, string> {
    return assessments.reduce((acc, assessment) => {
      acc[assessment] = 'pending';
      return acc;
    }, {});
  }
}
