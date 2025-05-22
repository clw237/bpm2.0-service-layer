import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ItemType } from 'src/entities/email-template.entity';
import CreateEmailTemplateLanguagesDto from './create-email-template-languages.dto';

export default class CreateCombinedEmailTemplateDto extends CreateEmailTemplateLanguagesDto {
  @ApiProperty({
    description: 'Email Template Name',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  template_name: string;

  @ApiProperty({
    description: 'Email Category Key',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  email_category_key: string;

  @ApiProperty({
    description: 'Workplace Key',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  workspace_key: string;

  @ApiProperty({
    description: 'Item Key',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  item_key: string;

  @ApiProperty({
    description: 'Item Type',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  item_type: ItemType;
}
