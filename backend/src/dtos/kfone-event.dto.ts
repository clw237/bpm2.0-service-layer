export interface CampaignLaunchedEventDto {
  type: 'CAMPAIGN_LAUNCHED';
  campaignId: string;
  workflowTemplateId: string;
  deadline: string;
  participants: { participantId: string; email: string }[];
}

export interface ParticipantsAddedEventDto {
  type: 'PARTICIPANTS_ADDED';
  campaignId: string;
  participants: { participantId: string; email: string }[];
}

export interface ParticipantCompletedEventDto {
  type: 'PARTICIPANT_COMPLETED';
  campaignId: string;
  participantId: string;
  assessment: string;
  status: 'COMPLETED' | 'PENDING';
  timestamp: string;
}

export interface RaterAssessmentCompletedEventDto {
  type: 'RATER_ASSESSMENT_COMPLETED';
  campaignId: string;
  raterId: string;
  assessment: string;
  status: 'COMPLETED' | 'PENDING';
  timestamp: string;
}
