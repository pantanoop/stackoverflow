import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

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

  @Get('/:id')
  async findQuestion(@Param('id') id: number) {
    console.log('dto hit in findQuestion by id', id);
    return this.questionsService.findQuestion(+id);
  }

  @Patch('/:id')
  async updateQuestion(@Body() updateQuestionDto: UpdateQuestionDto) {
    console.log('dto hit', updateQuestionDto);
    return this.questionsService.updateQuestion(updateQuestionDto);
  }
}
