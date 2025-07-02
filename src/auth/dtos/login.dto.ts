import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'demouser@yopmail.com',
    required: true,
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'Abcd@1234',
    required: true,
  })
  @IsString()
  password: string;
}
