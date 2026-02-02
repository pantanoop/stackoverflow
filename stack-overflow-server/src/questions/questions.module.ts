import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { Question } from './entities/question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../auth/entities/user.entity';
import { Tag } from '../../src/tags/entities/tag.entity';
import { Vote } from '../votes/entities/vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, User, Tag, Vote])],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
