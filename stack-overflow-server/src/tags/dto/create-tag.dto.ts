import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateTagDto {
  @IsOptional()
  @IsNumber({}, { message: 'tag id must be a number' })
  tagId: number;

  @IsString({ message: 'username must be a string' })
  @IsNotEmpty({ message: 'tag name can not be empty ' })
  tagName: string;
}
