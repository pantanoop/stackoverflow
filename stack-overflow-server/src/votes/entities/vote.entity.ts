import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity('votes')
@Unique(['userId', 'entityType', 'entityId'])
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: ['question', 'answer'],
  })
  entityType: 'question' | 'answer';

  @Column()
  entityId: number;

  @Column({
    type: 'enum',
    enum: ['upvote', 'downvote'],
  })
  voteType: 'upvote' | 'downvote';

  @CreateDateColumn()
  createdAt: Date;
}
