import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from '../../questions/entities/question.entity';

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

  //   @ManyToOne(() => Question, (question) => question.answers, {
  //     onDelete: 'CASCADE',
  //   })
  //   @JoinColumn({ name: 'questionId' })
  //   question: Question;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  questionId: number;

  @Column({ default: false })
  isValid: boolean;

  //   @Column({ default: 0 })
  //   upVote: number;

  //   @Column({ default: 0 })
  //   downVote: number;
}
