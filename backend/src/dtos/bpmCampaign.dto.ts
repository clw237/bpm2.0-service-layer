import { Type } from 'class-transformer';
import { IsArray, IsISO8601, IsString, ValidateNested } from 'class-validator';

export class BpmParticipantDto {
  @IsString()
  id: string;

  @IsString()
  email: string;
}

export class BpmCampaignDto {
  @IsString()
  id: string;

  @IsISO8601()
  deadline: string; // ISO8601 date string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BpmParticipantDto)
  participants: BpmParticipantDto[];
}
