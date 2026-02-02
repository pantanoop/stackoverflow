import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Answer } from '../../answers/entities/answer.entity';

@Entity('answer_replies')
export class AnswerReply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  answerId: number;

  @ManyToOne(() => Answer, (answer) => answer.replies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'answerId' })
  answer: Answer;

  @Column({ nullable: true })
  parentReplyId: number | null;

  @ManyToOne(() => AnswerReply, (reply) => reply.childReplies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentReplyId' })
  parentReply: AnswerReply;

  @OneToMany(() => AnswerReply, (reply) => reply.parentReply)
  childReplies: AnswerReply[];

  @Column('text')
  text: string;

  @Column()
  userId: string;

  @Column()
  username: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
