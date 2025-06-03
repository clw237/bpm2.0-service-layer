export interface BpmCampaignDto {
  id: string;
  deadline: string;
  participants: BpmParticipantDto[];
}

export interface BpmParticipantDto {
  id: string;
  email: string;
}
