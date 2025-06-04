import { IsArray, IsISO8601, IsPositive, IsUUID } from 'class-validator';
import { CreateUserDto } from 'dtos';

export default class CampaignDto {
  @IsUUID()
  id: string;

  @IsISO8601()
  deadline: string;

  @IsArray()
  participants: CreateUserDto[];

  @IsPositive()
  reminderDaysBefore: number;

  /*   @IsPositive()
  maxRetries: number;

  @IsPositive()
  retryIntervalDays: number; */
}
