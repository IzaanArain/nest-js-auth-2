import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @ApiProperty({ description: 'User name', example: 'John Doe' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'User email', example: 'demouser@yopmail.com' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({
    description: 'Hash user password',
    example: 'Abcd@1234',
  })
  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
