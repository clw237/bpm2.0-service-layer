import { IsArray, IsEmail, IsNumber, IsString } from 'class-validator';

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
