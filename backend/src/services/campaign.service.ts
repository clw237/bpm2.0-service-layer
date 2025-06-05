import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCampaignDto } from 'src/dtos';
import { Campaign, User } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export default class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private httpService: HttpService,
  ) {}

  async launchCampaign(dto: CreateCampaignDto): Promise<string> {
    const campaign = this.campaignRepository.create({
      ...dto,
      deadline: new Date(dto.deadline),
      participants: await this.userRepository.findByIds(dto.participantIds),
    });

    const savedCampaign = await this.campaignRepository.save(campaign);

    const bpmPayload = {
      CampaignId: savedCampaign.id,
      AssessmentDeadline: savedCampaign.deadline.toISOString(),
      ReminderDaysBefore: savedCampaign.reminderDaysBefore,
      Participants: savedCampaign.participants.map((p) => ({
        ParticipantId: p.id,
        Email: p.email,
        Status: this.createInitialStatus(savedCampaign.assessments),
      })),
    };

    const response = await this.httpService.axiosRef.post(
      '/decisions/api/flow/launch/GenericCampaignAssessmentWorkflow',
      bpmPayload,
    );

    await this.campaignRepository.update(savedCampaign.id, {
      bpmWorkflowId: response.data.workflowId,
    });

    return response.data.workflowId;
  }

  async updateParticipants(campaignId: string, participantIds: string[]) {
    const campaign = await this.campaignRepository.findOneOrFail({
      where: { id: campaignId },
      relations: ['participants'],
    });

    const newParticipants = await this.userRepository.findByIds(participantIds);

    // Sync with Decisions BPM
    await this.httpService.axiosRef.post(
      `/decisions/api/campaigns/${campaign.bpmWorkflowId}/participants`,
      newParticipants.map((p) => ({
        ParticipantId: p.id,
        Email: p.email,
        Status: this.createInitialStatus(campaign.assessments),
      })),
    );

    campaign.participants = newParticipants;
    return this.campaignRepository.save(campaign);
  }

  private createInitialStatus(assessments: string[]) {
    return assessments.reduce((acc, assessment) => {
      acc[assessment] = 'pending';
      return acc;
    }, {});
  }
}
