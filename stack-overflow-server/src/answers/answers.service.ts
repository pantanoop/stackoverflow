import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Answer } from './entities/answer.entity';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { Vote } from '../votes/entities/vote.entity';
import { User } from '../../src/auth/entities/user.entity';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private readonly ansRepository: Repository<Answer>,

    @InjectRepository(Vote)
    private readonly voteRepo: Repository<Vote>,
  ) {}

  private async getAnswerVotes(answerId: number) {
    const upvotes = await this.voteRepo.count({
      where: {
        entityType: 'answer',
        entityId: answerId,
        voteType: 'upvote',
      },
    });

    const downvotes = await this.voteRepo.count({
      where: {
        entityType: 'answer',
        entityId: answerId,
        voteType: 'downvote',
      },
    });

    return {
      upvotes,
      downvotes,
      score: upvotes - downvotes,
    };
  }

  async PostAnswer(postDto: CreateAnswerDto) {
    const answer = this.ansRepository.create({
      questionId: Number(postDto.questionId),
      userId: postDto.userId,
      answer: postDto.answer,
    });

    const saved = await this.ansRepository.save(answer);

    const fullAnswer = await this.ansRepository.findOne({
      where: { id: saved.id },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    if (!fullAnswer) {
      throw new HttpException('Failed to create answer', 500);
    }

    const votes = await this.getAnswerVotes(fullAnswer.id);

    return {
      id: fullAnswer.id,
      answer: fullAnswer.answer,
      createdAt: fullAnswer.createdAt,
      updatedAt: fullAnswer.updatedAt,
      questionId: fullAnswer.questionId,
      userId: fullAnswer.userId,
      username: fullAnswer.user.username,
      upvotes: votes.upvotes,
      downvotes: votes.downvotes,
      score: votes.score,
    };
  }

  async GetAnswer(questionId: number) {
    const answers = await this.ansRepository.find({
      where: { questionId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    if (!answers.length) {
      throw new HttpException({ message: 'Answers not found' }, 404);
    }

    return Promise.all(
      answers.map(async (a) => {
        const votes = await this.getAnswerVotes(a.id);

        return {
          id: a.id,
          answer: a.answer,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
          questionId: a.questionId,
          userId: a.userId,
          username: a.user?.username || 'Anonymous',
          upvotes: votes.upvotes,
          downvotes: votes.downvotes,
          score: votes.score,
        };
      }),
    );
  }

  async updateAnswer(payload: {
    answerId: number;
    userId: string;
    answer: string;
  }) {
    const answer = await this.ansRepository.findOne({
      where: { id: payload.answerId },
      relations: ['user'],
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    if (answer.userId !== payload.userId) {
      throw new HttpException(
        { message: 'You are not allowed to edit this answer' },
        403,
      );
    }

    answer.answer = payload.answer;

    const saved = await this.ansRepository.save(answer);
    const votes = await this.getAnswerVotes(saved.id);

    return {
      id: saved.id,
      answer: saved.answer,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
      questionId: saved.questionId,
      userId: saved.userId,
      username: saved.user.username,
      upvotes: votes.upvotes,
      downvotes: votes.downvotes,
      score: votes.score,
    };
  }


  async MarkValidAnswer(id: number) {
    const answer = await this.ansRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!answer) throw new NotFoundException('Answer not found');

    answer.isValid = true;

    const saved = await this.ansRepository.save(answer);

    const votes = await this.getAnswerVotes(saved.id);
    return {
      ...saved,
      username: saved.user.username,
      ...votes,
    };
  }
}
