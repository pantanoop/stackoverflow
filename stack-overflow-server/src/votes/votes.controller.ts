import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  /**
   * Upvote / Downvote / Toggle
   */
  @Post()
  vote(@Body() createVoteDto: CreateVoteDto) {
    return this.votesService.vote(createVoteDto);
  }

  /**
   * Get vote counts
   * /votes/count?entityType=question&entityId=1
   */
  @Get('count')
  getCount(
    @Query('entityType') entityType: 'question' | 'answer',
    @Query('entityId') entityId: number,
  ) {
    return this.votesService.getVoteCount(entityType, Number(entityId));
  }
}
