import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tagId: number;

  @Column({ unique: true, nullable: false })
  tagName: string;
}
