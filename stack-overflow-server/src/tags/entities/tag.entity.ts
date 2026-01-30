import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', unique: true })
  tagId: bigint;

  @Column({ unique: true, nullable: false })
  tagName: string;
}
