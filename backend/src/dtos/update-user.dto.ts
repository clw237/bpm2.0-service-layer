import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export default class UpdateUserDto {
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
