import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnswerReply } from './entities/answer-reply.entity';
import { CreateAnswerReplyDto } from './dto/create-answer-reply.dto';

@Injectable()
export class AnswerReplyService {
  constructor(
    @InjectRepository(AnswerReply)
    private readonly repo: Repository<AnswerReply>,
  ) {}

  async create(dto: CreateAnswerReplyDto): Promise<AnswerReply> {
    const reply = this.repo.create(dto);
    return this.repo.save(reply);
  }

  async findByAnswer(answerId: number): Promise<AnswerReply[]> {
    return this.repo.find({
      where: { answerId },
      relations: ['childReplies', 'childReplies.childReplies'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByParentReply(parentReplyId: number): Promise<AnswerReply[]> {
    return this.repo.find({
      where: { parentReplyId },
      relations: ['childReplies'],
      order: { createdAt: 'DESC' },
    });
  }
}
