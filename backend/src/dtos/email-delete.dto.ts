import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class EmailDelete {
  @ApiProperty({
    description: 'template key to delete',
    type: [String],
    required: true,
  })
  @IsNotEmpty()
  templateKeys: string[];
}
