import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AnswerReplyService } from './answer-reply.service';
import { CreateAnswerReplyDto } from './dto/create-answer-reply.dto';

@Controller('answer-replies')
export class AnswerReplyController {
  constructor(private readonly replyService: AnswerReplyService) {}

  // Create a new reply
  @Post()
  create(@Body() dto: CreateAnswerReplyDto) {
    return this.replyService.create(dto);
  }

  // Get all replies for an answer (nested included)
  @Get(':answerId')
  findByAnswer(@Param('answerId') answerId: number) {
    return this.replyService.findByAnswer(answerId);
  }

  // Optional: Get replies for a specific parent reply (for frontend lazy loading)
  @Get('parent/:parentReplyId')
  findByParent(@Param('parentReplyId') parentReplyId: number) {
    return this.replyService.findByParentReply(parentReplyId);
  }
}
