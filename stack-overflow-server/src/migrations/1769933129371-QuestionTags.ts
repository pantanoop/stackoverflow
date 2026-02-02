/* eslint-disable */
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class QuestionTags1769933129371 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'question_tags',
        columns: [
          {
            name: 'questionId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'tagId',
            type: 'int',
            isPrimary: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'question_tags',
      new TableForeignKey({
        columnNames: ['questionId'],
        referencedTableName: 'Questions',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'question_tags',
      new TableForeignKey({
        columnNames: ['tagId'],
        referencedTableName: 'Tags',
        referencedColumnNames: ['id'],
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('question_tags');
    if (table) {
      const foreignKeys = table.foreignKeys;
      await queryRunner.dropForeignKeys('question_tags', foreignKeys);
    }

    await queryRunner.dropTable('question_tags');
  }
}
