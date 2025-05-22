import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateEmailTemplateLanguagesDto {
  @ApiProperty({
    description: 'Email language',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  language_code: string;

  @ApiProperty({
    description: 'Email subject',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'Email body',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  body: string;
}
