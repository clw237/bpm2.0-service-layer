import { IsArray, IsEmail, IsNumber, IsString, IsUUID } from 'class-validator';

// For /api/reminders/send webhook
export class ReminderDto {
  @IsString()
  campaignId: string;

  @IsString()
  participantId: string;

  @IsEmail()
  email: string;

  @IsArray()
  @IsString({ each: true })
  missingAssessments: string[];

  @IsNumber()
  attempt: number;
}

// For /api/participants/markInactive webhook
export class InactiveDto {
  @IsString()
  campaignId: string;

  @IsString()
  participantId: string;
}

// For /api/campaigns/summary webhook
export class SummaryDto {
  @IsString()
  campaignId: string;

  @IsEmail()
  ownerEmail: string;

  @IsNumber()
  completedCount: number;

  @IsNumber()
  incompleteCount: number;
}

export class WebhookDto {
  @IsUUID()
  participantId: number;
}
