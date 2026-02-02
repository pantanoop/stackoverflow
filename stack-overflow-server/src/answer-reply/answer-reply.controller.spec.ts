import { Test, TestingModule } from '@nestjs/testing';
import { AnswerReplyController } from './answer-reply.controller';
import { AnswerReplyService } from './answer-reply.service';

describe('AnswerReplyController', () => {
  let controller: AnswerReplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnswerReplyController],
      providers: [AnswerReplyService],
    }).compile();

    controller = module.get<AnswerReplyController>(AnswerReplyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
