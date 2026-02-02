import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Question } from '../../questions/entities/question.entity';

@Entity('Tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', unique: true })
  tagId: bigint;

  @Column({ unique: true, nullable: false })
  tagName: string;

  @ManyToMany(() => Question, (question) => question.tags)
  questions: Question[];
}
