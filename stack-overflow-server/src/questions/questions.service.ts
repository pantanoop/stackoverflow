import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { User } from '../auth/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async addQuestion(createQuestionDto: CreateQuestionDto) {
    const question = this.questionRepository.create(createQuestionDto);
    return await this.questionRepository.save(question);
  }

  async findAll(limit = 10, page = 1) {
    //  return this.orderRepo.find({
    //       relations: ["items"],
    //       order: {
    //         createdAt: "DESC",
    //       },
    //     });
    const questions = await this.questionRepository.find({
      where: { type: 'public' },
      // relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    let total = questions.length;
    return { questions, total, page, limit };
  }

  async findQuestion(id: number) {
    const question = await this.questionRepository.findOne({
      where: { id: id },
    });
    if (!question) {
      throw new HttpException(
        { message: 'Question Not Found with this id' },
        404,
      );
    }
    return question;
  }
}
