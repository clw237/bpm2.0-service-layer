import { IsArray, IsEnum, IsISO8601, IsString, IsUUID } from 'class-validator';

export class CreateCampaignDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsISO8601()
  deadline: string;

  @IsArray()
  @IsUUID('all', { each: true })
  participantIds: string[];

  @IsArray()
  @IsString({ each: true })
  assessments: string[];
}

export class CampaignUpdateDto {
  @IsArray()
  @IsUUID('all', { each: true })
  participantIds: string[];
}

export class ParticipantStatusUpdateDto {
  @IsString()
  assessment: string;

  @IsEnum(['COMPLETED', 'PENDING'])
  status: string;
}
