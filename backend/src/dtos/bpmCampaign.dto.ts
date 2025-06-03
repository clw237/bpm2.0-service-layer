import {
  IsArray,
  IsEmail,
  IsISO8601,
  IsPositive,
  IsUUID,
} from 'class-validator';

class BpmParticipantDto {
  @IsUUID()
  id: string;

  @IsEmail()
  email: string;
}

export class BpmCampaignDto {
  @IsUUID()
  id: string;

  @IsISO8601()
  deadline: string;

  @IsArray()
  participants: BpmParticipantDto[];

  @IsPositive()
  reminderDaysBefore: number;

  @IsPositive()
  maxRetries: number;

  @IsPositive()
  retryIntervalDays: number;
}
