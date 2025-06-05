import {
  IsArray,
  IsEnum,
  IsIn,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCampaignDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  workflowTemplateId: string;

  @IsString()
  name: string;

  @IsISO8601()
  deadline: string;

  @IsNumber()
  @IsIn([1, 3, 7, 14]) // From requirements: configurable reminder intervals
  reminderDaysBefore: number;

  @IsArray()
  @IsUUID('all', { each: true })
  participantIds: string[];

  @IsArray()
  @IsString({ each: true })
  @IsIn(['traits', 'drivers', 'competencies'], { each: true }) // Standardized assessments
  assessments: string[];
}

export class CampaignLaunchResponseDto {
  campaignId: string;
  bpmWorkflowInstanceId: string; // Stores Decisions instance ID
}

export class CampaignUpdateDto {
  @IsArray()
  @IsUUID('all', { each: true })
  participantIds: string[];
}

export class ParticipantStatusUpdateDto {
  @IsIn(['traits', 'drivers', 'competencies'])
  assessment: string;

  @IsEnum(['COMPLETED', 'PENDING'])
  status: string;
}
