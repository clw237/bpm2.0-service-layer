import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class PublishDto {
  @ApiProperty({
    description: 'root object holding rabbit mq message',
  })
  @IsNotEmpty()
  message: JSON;
}

export class PublishDtoArray {
  @ApiProperty({
    description: 'Email message properties',
    type: 'object',
  })
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  toEmailaddress: string;

  @IsNotEmpty()
  emailCategoryCode: string;

  passwordLink?: string;
}
