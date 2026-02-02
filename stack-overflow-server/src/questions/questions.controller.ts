import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Put,
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

  @Get('/admin')
  async getQuestionsAdmin(
    @Query('limit') limit: string,
    @Query('page') page: string,
  ) {
    const l = limit ? parseInt(limit) : 10;
    const p = page ? parseInt(page) : 1;
    return this.questionsService.findAllAdmin(l, p);
  }

  @Get('/:id')
  async findQuestion(@Param('id') id: number) {
    console.log('dto hit in findQuestion by id', id);
    return this.questionsService.findQuestion(+id);
  }

  @Get('draft/:id')
  async findQuestionDraft(@Param('id') id: string) {
    console.log('dto hit in findQuestion by id', id);
    return this.questionsService.findAllDraft(id);
  }

  @Patch('/:id')
  async updateQuestion(@Body() updateQuestionDto: UpdateQuestionDto) {
    console.log('dto hit', updateQuestionDto);
    return this.questionsService.updateQuestion(updateQuestionDto);
  }

  @Patch('/markPublic/:id')
  async updateQuestionPublic(@Param('id') id: number) {
    console.log('dto hit mark public', id);
    return this.questionsService.PostPublicDraft(id);
  }
  @Patch(':id/ban')
  toggleBanQuestion(@Param('id') id: number) {
    return this.questionsService.toggleBanQuestion(id);
  }
}
