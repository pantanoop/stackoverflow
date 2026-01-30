import { Answer } from '../../answers/entities/answer.entity';
import { User } from '../../auth/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('Questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('simple-array')
  tags: string[];

  // @ManyToOne(() => User, (user) => user.question)
  // @JoinColumn({ name: 'userid ' })
  // user: User;

  // @OneToMany(() => Answer, (answer) => answer.question, {
  //   onDelete: 'CASCADE',
  // })
  // answers: Answer[];

  @Column()
  type: string;

  @Column()
  userid: string;

  @CreateDateColumn()
  createdAt: Date;
}
