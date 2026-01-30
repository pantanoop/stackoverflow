import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';

@Controller('answers')
export class AnswersController {
  constructor(private readonly answerService: AnswersService) {}

  @Post()
  PostAnswer(@Body() postDto: CreateAnswerDto) {
    console.log('dto hit');
    return this.answerService.PostAnswer(postDto);
  }

  @Get(':id')
  GetAnswer(@Param('id') id: number) {
    return this.answerService.GetAnswer(+id);
  }

  // @Get()
  // getAllAnswers() {
  //   return this.answerService.getAll();
  // }
}
