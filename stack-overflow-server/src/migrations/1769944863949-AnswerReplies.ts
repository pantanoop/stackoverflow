import { MigrationInterface, QueryRunner } from 'typeorm';

export class AnswerReplies1769944863949 implements MigrationInterface {
  name = 'AnswerReplies1769944863949';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "answer_replies" (
                "id" SERIAL NOT NULL, 
                "answerId" integer NOT NULL, 
                "parentReplyId" integer, 
                "text" text NOT NULL, 
                "userId" character varying NOT NULL, 
                "username" character varying NOT NULL, 
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
                CONSTRAINT "PK_7334d61b7b9099d5f1a2af2ae23" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            ALTER TABLE "answer_replies" 
            ADD CONSTRAINT "FK_6cc3d849b168605a6a235622c51" 
            FOREIGN KEY ("answerId") REFERENCES "answers"("id") 
            ON DELETE CASCADE
        `);

    await queryRunner.query(`
            ALTER TABLE "answer_replies" 
            ADD CONSTRAINT "FK_e6ff260ac09cfb4e7197eb1c93d" 
            FOREIGN KEY ("parentReplyId") REFERENCES "answer_replies"("id") 
            ON DELETE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "answer_replies" DROP CONSTRAINT "FK_e6ff260ac09cfb4e7197eb1c93d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer_replies" DROP CONSTRAINT "FK_6cc3d849b168605a6a235622c51"`,
    );
    await queryRunner.query(`DROP TABLE "answer_replies"`);
  }
}
