import { IsDateString, IsNumber, IsString, IsUUID } from 'class-validator';

export class UserPoolReminderDto {
  @IsNumber()
  reminder: number; // Number of days until the reminder date

  @IsDateString()
  reminder_date: string; // The reminder date in ISO format

  @IsUUID()
  workspace_key: string; // UUID format for workspace key

  @IsUUID()
  workspace_user_key: string; // UUID format for workspace user key

  @IsString()
  email_address: string; // User's email address

  @IsString()
  last_name: string; // User's last name

  @IsString()
  first_name: string; // User's first name

  @IsDateString()
  execution_date: string;

  @IsString()
  language_code: string;

  @IsString()
  unique_key: string;
}
