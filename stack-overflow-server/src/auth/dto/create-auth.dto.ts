import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAuthDto {
  @IsEmail()
  email: string;

  @IsString({ message: 'username must be a string' })
  @IsOptional()
  username: string;
}
