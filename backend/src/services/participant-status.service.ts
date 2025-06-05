import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export default class ParticipantStatusService {
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
    // Update in Decisions BPM
    await this.httpService.axiosRef.post(
      '/decisions/api/updateParticipantStatus',
      {
        campaignId,
        participantId,
        status: { [assessment]: status },
      },
    );

    return { success: true };
  }
}
