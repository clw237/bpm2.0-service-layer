import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export default class CreateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    type: String,
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The username of the user',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  username: string;
}
