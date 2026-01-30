import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { Answer } from './entities/answer.entity';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private readonly ansRepository: Repository<Answer>,
  ) {}
  async PostAnswer(postDto: CreateAnswerDto) {
    const answer = this.ansRepository.create({
      questionId: Number(postDto.questionId),
      userId: postDto.userId,
      answer: postDto.answer,
    });
    const res = await this.ansRepository.save(answer);
    console.log(res);
  }

  async GetAnswer(id: number) {
    const existsQuestion = await this.ansRepository.findOne({
      where: { questionId: id },
    });
    if (!existsQuestion) {
      throw new HttpException({ message: 'Question not found' }, 404);
    }

    const answers = await this.ansRepository.find({
      where: { questionId: id },
    });
    return answers;
  }
}
