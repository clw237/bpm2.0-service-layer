import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    type: String,
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The username of the user',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'The email of the user',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'The username of the user',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;
}

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
