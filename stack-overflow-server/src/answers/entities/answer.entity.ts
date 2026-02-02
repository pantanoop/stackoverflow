import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Question } from '../../questions/entities/question.entity';
import { AnswerReply } from '../../answer-reply/entities/answer-reply.entity';
import { Post } from '@nestjs/common';
@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  answer: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  questionId: number;

  @Column({ default: false })
  isValid: boolean;

  @ManyToOne(() => User, (user) => user.answers)
  @JoinColumn({ name: 'userId', referencedColumnName: 'userid' })
  user: User;

  @ManyToOne(() => Question, (question) => question.answers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @OneToMany(() => AnswerReply, (reply) => reply.answer)
  replies: AnswerReply[];

  //   @Column({ default: 0})
  //   upVote: number;

  //   @Column({ default: 0 })
  //   downVote: number;s
}
