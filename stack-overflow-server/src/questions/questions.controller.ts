import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  async addQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    console.log('dto hitt', createQuestionDto);
    return this.questionsService.addQuestion(createQuestionDto);
  }

  @Get()
  async getQuestions(
    @Query('limit') limit: string,
    @Query('page') page: string,
  ) {
    const l = limit ? parseInt(limit) : 10;
    const p = page ? parseInt(page) : 1;
    return this.questionsService.findAll(l, p);
  }
}
