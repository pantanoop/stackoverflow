/* eslint-disable */
import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class Votes1769937794057 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'votes',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'entityType',
            type: 'enum',
            enum: ['question', 'answer'],
          },
          {
            name: 'entityId',
            type: 'int',
          },
          {
            name: 'voteType',
            type: 'enum',
            enum: ['upvote', 'downvote'],
          },
          {
            name: 'createdAt',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
        uniques: [
          new TableUnique({
            columnNames: ['userId', 'entityType', 'entityId'],
          }),
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('votes');
  }
}
