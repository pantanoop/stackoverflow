import {
  MigrationInterface,
  QueryRunner,
  Table,
  // TableForeignKey,
} from 'typeorm';

export class Answer1769768602105 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'answers',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'questionId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'userId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'answer',
            type: 'text',
            isNullable: false,
          },

          {
            name: 'isValid',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'NOW()',
          },
        ],
      }),
      true,
    );

    // await queryRunner.createForeignKey(
    //   'answers',
    //   new TableForeignKey({
    //     columnNames: ['userId'],
    //     referencedTableName: 'Users',
    //     referencedColumnNames: ['userid'],
    //     onDelete: 'CASCADE',
    //   }),
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('answers');
  }
}
