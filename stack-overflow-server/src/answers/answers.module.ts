import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { User } from '../auth/entities/user.entity';
import { Vote } from '../../src/votes/entities/vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, User, Vote])],
  controllers: [AnswersController],
  providers: [AnswersService],
})
export class AnswersModule {}
