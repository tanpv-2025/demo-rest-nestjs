import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTagTable1680778605355 implements MigrationInterface {
  name = 'CreateTagTable1680778605355';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tags" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "updated" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "created" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "deleted" TIMESTAMP(3),
        "post_id" uuid NOT NULL,
        "name" character varying(255) NOT NULL,
        CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"),
        CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_5d24df644df0e3d5b3b7c1447e" ON "tags" ("name") WHERE deleted IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5d24df644df0e3d5b3b7c1447e"`,
    );
    await queryRunner.query(`DROP TABLE "tags"`);
  }
}
