import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
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
    console.log('dto hit ans wala  return', id);
    return this.answerService.GetAnswer(+id);
  }

  @Patch(':id')
  updateAnswer(
    @Param('id') id: number,
    @Body() body: { answerId: number; userId: string; answer: string },
  ) {
    console.log('dto hit', body);
    return this.answerService.updateAnswer(body);
  }
}
