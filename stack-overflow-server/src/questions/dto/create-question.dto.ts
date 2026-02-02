import {
  IsString,
  IsArray,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
  IsBoolean,
} from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @MinLength(15)
  @MaxLength(55)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsEnum(['draft', 'public'])
  type: 'draft' | 'public';

  @IsBoolean()
  @IsOptional()
  isBanned: boolean;

  @IsString()
  userid: string;
}
