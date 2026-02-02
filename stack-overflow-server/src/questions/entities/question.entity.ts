import { User } from '../../auth/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Tag } from '../../tags/entities/tag.entity';
import { Answer } from '../../answers/entities/answer.entity';

@Entity('Questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  type: string;

  @Column()
  userid: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  isBanned: boolean;

  @ManyToOne(() => User, (user) => user.questions, { eager: true })
  @JoinColumn({ name: 'userid', referencedColumnName: 'userid' })
  user: User;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];

  @ManyToMany(() => Tag, (tag) => tag.questions, { cascade: true })
  @JoinTable({
    name: 'question_tags',
    joinColumn: {
      name: 'questionId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tagId',
      referencedColumnName: 'id',
    },
  })
  tags: Tag[];
}
