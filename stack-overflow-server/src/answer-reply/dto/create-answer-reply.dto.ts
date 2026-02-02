import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateAnswerReplyDto {
  @IsNumber({}, { message: 'answerId must be a number' })
  answerId: number;

  @IsNumber({}, { message: 'parentReplyId must be a number' })
  @IsOptional()
  parentReplyId?: number; // Optional, only for nested replies

  @IsString({ message: 'userId must be a string' })
  @IsNotEmpty({ message: 'userId cannot be empty' })
  userId: string;

  @IsString({ message: 'username must be a string' })
  @IsNotEmpty({ message: 'username cannot be empty' })
  username: string;

  @IsString({ message: 'text must be a string' })
  @IsNotEmpty({ message: 'text cannot be empty' })
  text: string;
}
