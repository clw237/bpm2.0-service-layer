import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class EmailWhiteListDto {
  @ApiProperty({
    description: 'email address',
    type: [String],
    required: true,
  })
  @IsNotEmpty()
  emails: [string];
}
