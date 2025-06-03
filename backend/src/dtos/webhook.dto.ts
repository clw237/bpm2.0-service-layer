import { IsArray, IsEmail, IsNumber, IsString } from 'class-validator';

// For /api/reminders/send webhook
export class BpmReminderDto {
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
export class BpmInactiveDto {
  @IsString()
  campaignId: string;

  @IsString()
  participantId: string;
}

// For /api/campaigns/summary webhook
export class BpmSummaryDto {
  @IsString()
  campaignId: string;

  @IsEmail()
  ownerEmail: string;

  @IsNumber()
  completedCount: number;

  @IsNumber()
  incompleteCount: number;
}
