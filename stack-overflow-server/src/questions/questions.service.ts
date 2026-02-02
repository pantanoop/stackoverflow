import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { User } from '../auth/entities/user.entity';
import { Tag } from '../tags/entities/tag.entity';
import { Vote } from '../votes/entities/vote.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,

    @InjectRepository(Vote)
    private readonly voteRepo: Repository<Vote>,
  ) {}

  private async getVoteCount(questionId: number) {
    const upvotes = await this.voteRepo.count({
      where: {
        entityType: 'question',
        entityId: questionId,
        voteType: 'upvote',
      },
    });

    const downvotes = await this.voteRepo.count({
      where: {
        entityType: 'question',
        entityId: questionId,
        voteType: 'downvote',
      },
    });

    return {
      upvotes,
      downvotes,
      score: upvotes - downvotes,
    };
  }

  async addQuestion(createQuestionDto: CreateQuestionDto) {
    const { tags, ...questionData } = createQuestionDto;

    const existingTags = await this.tagRepo.find({
      where: { tagName: In(tags) },
    });

    const existingTagNames = existingTags.map((t) => t.tagName);

    const newTags = tags
      .filter((tag) => !existingTagNames.includes(tag))
      .map((tag) =>
        this.tagRepo.create({
          tagName: tag,
          tagId: BigInt(Date.now() + Math.floor(Math.random() * 1000)),
        }),
      );

    const savedNewTags = await this.tagRepo.save(newTags);

    const question = this.questionRepository.create({
      ...questionData,
      tags: [...existingTags, ...savedNewTags],
    });

    const saved = await this.questionRepository.save(question);

    return {
      id: saved.id,
      title: saved.title,
      description: saved.description,
      tags: saved.tags.map((t) => t.tagName),
      type: saved.type,
      createdAt: saved.createdAt,
      userid: saved.userid,
    };
  }

  async findAll(limit = 10, page = 1) {
    console.log('find all questions hittted service');
    const [questions, total] = await this.questionRepository.findAndCount({
      where: { type: 'public' },
      relations: ['user', 'tags'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    const formattedQuestions = await Promise.all(
      questions.map(async (q) => {
        const votes = await this.getVoteCount(q.id);

        return {
          id: q.id,
          title: q.title,
          description: q.description,
          tags: q.tags.map((t) => t.tagName),
          type: q.type,
          createdAt: q.createdAt,
          userid: q.userid,
          username: q.user?.username,
          upvotes: votes.upvotes,
          downvotes: votes.downvotes,
          score: votes.score,
        };
      }),
    );

    return {
      formattedQuestions: formattedQuestions,
      total,
      page,
      limit,
    };
  }

  async findQuestion(id: number) {
    console.log('hitted service', id);
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['user', 'tags'],
    });

    if (!question) {
      throw new HttpException(
        { message: 'Question Not Found with this id' },
        404,
      );
    }

    const votes = await this.getVoteCount(question.id);

    return {
      id: question.id,
      title: question.title,
      description: question.description,
      tags: question.tags.map((t) => t.tagName),
      type: question.type,
      createdAt: question.createdAt,
      userid: question.userid,
      username: question.user?.username,
      upvotes: votes.upvotes,
      downvotes: votes.downvotes,
      score: votes.score,
    };
  }

  async updateQuestion(updateQuestionDto: UpdateQuestionDto) {
    const { userid, questionId, tags, ...updateData } = updateQuestionDto;

    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: ['tags'],
    });

    if (!question) {
      throw new HttpException({ message: 'Question not found' }, 404);
    }

    if (question.userid !== userid) {
      throw new HttpException(
        { message: 'You are not allowed to edit this question' },
        403,
      );
    }

    if (tags) {
      const existingTags = await this.tagRepo.find({
        where: { tagName: In(tags) },
      });

      const existingTagNames = existingTags.map((t) => t.tagName);

      const newTags = tags
        .filter((tag) => !existingTagNames.includes(tag))
        .map((tag) =>
          this.tagRepo.create({
            tagName: tag,
            tagId: BigInt(Date.now() + Math.floor(Math.random() * 1000)),
          }),
        );

      const savedNewTags = await this.tagRepo.save(newTags);

      question.tags = [...existingTags, ...savedNewTags];
    }

    Object.assign(question, updateData);

    const saved = await this.questionRepository.save(question);

    return {
      id: saved.id,
      title: saved.title,
      description: saved.description,
      tags: saved.tags.map((t) => t.tagName),
      type: saved.type,
      createdAt: saved.createdAt,
      userid: saved.userid,
    };
  }
}
