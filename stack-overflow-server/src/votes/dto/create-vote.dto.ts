import { IsEnum, IsInt, IsString } from 'class-validator';

export class CreateVoteDto {
  @IsString()
  userId: string;

  @IsEnum(['question', 'answer'])
  entityType: 'question' | 'answer';

  @IsInt()
  entityId: number;

  @IsEnum(['upvote', 'downvote'])
  voteType: 'upvote' | 'downvote';
}
