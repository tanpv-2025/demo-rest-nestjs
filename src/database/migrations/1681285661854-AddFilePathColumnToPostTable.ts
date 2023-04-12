import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFilePathColumnToPostTable1681285661854 implements MigrationInterface {
    name = 'AddFilePathColumnToPostTable1681285661854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "file_path" character varying(2000)`);
        await queryRunner.query(`ALTER TABLE "tags" ADD CONSTRAINT "FK_b20aaa37aa83f407ff31c82ded5" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" DROP CONSTRAINT "FK_b20aaa37aa83f407ff31c82ded5"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "file_path"`);
    }

}
