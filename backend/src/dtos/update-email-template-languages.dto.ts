import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ItemType } from 'src/entities/email-template.entity';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import CreateEmailTemplateLanguagesDto from './create-email-template-languages.dto';

export default class UpdateEmailTemplateLanguagesDto extends PartialType(
  CreateEmailTemplateLanguagesDto,
) {
  @ApiProperty({
    description: 'Existing Template Key for update',
    type: UUID,
    required: false,
  })
  @IsString()
  @IsOptional()
  template_key?: string;

  @ApiProperty({
    description: 'Email category Key for update',
    type: UUID,
    required: true,
  })
  @IsString()
  email_category_key?: string;

  @ApiProperty({
    description: 'Workspace Key',
    type: UUID,
    required: true,
  })
  @IsString()
  workspace_key?: string;

  @ApiProperty({
    description: 'item Key',
    type: UUID,
    required: true,
  })
  @IsString()
  item_key?: string;

  @ApiProperty({
    description: 'item type',
    type: String,
    required: true,
  })
  @IsString()
  item_type: ItemType;

  @ApiProperty({
    description: 'Email Template Name',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  template_name?: string;

  @ApiProperty({
    description: 'Email language',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  language_code?: string;

  @ApiProperty({
    description: 'Email subject',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiProperty({
    description: 'Email body',
    type: String,
    required: true,
  })
  @IsString()
  body?: string;

  @ApiProperty({
    description: 'Updated By',
    type: String,
    required: false,
    default: null,
  })
  @IsString()
  @IsOptional()
  updated_by_user?: string;

  @ApiProperty({
    description: 'created By',
    type: String,
    required: false,
    default: null,
  })
  @IsString()
  @IsOptional()
  created_by_user?: string;
}
