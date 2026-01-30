import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString({ message: 'user id must be a string' })
  @IsOptional()
  userid: string;

  @IsEmail()
  email: string;

  @IsString({ message: 'username must be a string' })
  @IsOptional()
  username: string;
}
