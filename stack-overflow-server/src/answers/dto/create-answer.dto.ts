import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
export class CreateAnswerDto {
  @IsNumber({}, { message: 'enter only string' })
  @IsOptional()
  questionId: string;

  @IsString({ message: 'enter only string' })
  @IsNotEmpty({ message: 'this field cannot be emty' })
  userId: string;

  @IsString({ message: 'enter only string' })
  @IsNotEmpty({ message: 'this field cannot be emty' })
  answer: string;
}
