import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
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

  @Column()
  type: string;

  @Column()
  userid: string;

  @CreateDateColumn()
  createdAt: Date;
}
