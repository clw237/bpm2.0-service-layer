import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class EmailTemplatesDto {
  @ApiProperty({
    description: 'template key',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  template_key: string;

  @ApiProperty({
    description: 'language code',
    type: String,
    required: false,
    default: 'en-US',
  })
  @IsNotEmpty()
  lang: string;

  @ApiProperty({
    description: 'email category key',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  email_category_key: string;

  @ApiProperty({
    description: 'item key',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  campaign_key: string;
}
