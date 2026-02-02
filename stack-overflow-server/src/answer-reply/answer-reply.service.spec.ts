import { Test, TestingModule } from '@nestjs/testing';
import { AnswerReplyService } from './answer-reply.service';

describe('AnswerReplyService', () => {
  let service: AnswerReplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnswerReplyService],
    }).compile();

    service = module.get<AnswerReplyService>(AnswerReplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
