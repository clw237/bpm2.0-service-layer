import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class CheckTemplateNameDto {
  @ApiProperty({
    description: 'Template name to check',
    example: 'WelcomeEmail',
  })
  @IsString()
  @IsNotEmpty()
  template_name: string;

  @ApiProperty({
    description: 'Workspace key to check',
  })
  @IsString()
  @IsNotEmpty()
  workspace_key: string;

  @ApiProperty({
    description: 'Client key to check',
  })
  @IsString()
  @IsNotEmpty()
  item_key: string;
}
