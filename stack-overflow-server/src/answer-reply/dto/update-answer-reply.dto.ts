import { PartialType } from '@nestjs/mapped-types';
import { CreateAnswerReplyDto } from './create-answer-reply.dto';

export class UpdateAnswerReplyDto extends PartialType(CreateAnswerReplyDto) {}
