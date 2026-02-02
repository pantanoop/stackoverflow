import { Module } from '@nestjs/common';
import { AnswerReplyService } from './answer-reply.service';
import { AnswerReplyController } from './answer-reply.controller';
import { AnswerReply } from './entities/answer-reply.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AnswerReply])],
  controllers: [AnswerReplyController],
  providers: [AnswerReplyService],
})
export class AnswerReplyModule {}
