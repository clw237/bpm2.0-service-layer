import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ItemType } from 'src/entities/email-template.entity';

export class SchedulerDto {
  @ApiProperty({ description: 'Workspace Key', type: String })
  @IsUUID()
  workspace_key: string;

  @ApiProperty({ description: 'Schedule Type Key', type: String })
  @IsUUID()
  schedule_type_key: string;

  @ApiProperty({ description: 'Scheduler Name', type: String })
  @IsString()
  scheduler_name: string;

  @ApiProperty({ description: 'Template Key', type: String })
  @IsUUID()
  template_key: string;

  @ApiProperty({ description: 'Item Key', type: String })
  @IsUUID()
  item_key: string;

  @ApiProperty({ description: 'Item Type', type: String, enum: ItemType })
  @IsString()
  item_type: string;

  @ApiProperty({ description: 'Start Date', type: Date, format: 'date' })
  @IsDateString()
  start_date: Date;

  @ApiProperty({ description: 'End Date', type: Date, format: 'date' })
  @IsDateString()
  end_date: Date;

  @ApiProperty({ description: 'Schedule JSON', type: Object, required: false })
  @IsOptional()
  schedule_json?: object;

  @ApiProperty({ description: 'Max Occurrence', type: Number, required: false })
  @IsOptional()
  @IsNumber()
  max_occurrence?: number;

  @ApiProperty({ description: 'Is Enabled', type: Boolean, default: true })
  @IsOptional()
  @IsBoolean()
  is_enabled?: boolean;

  @ApiProperty({ description: 'Created By User', type: String })
  @IsString()
  created_by_user: string;

  @ApiProperty({ description: 'Updated By User', type: String })
  @IsString()
  updated_by_user: string;
}

export default class CreateSchedulerDto {
  scheduler_key: string;
  scheduleData: SchedulerDto;
}
