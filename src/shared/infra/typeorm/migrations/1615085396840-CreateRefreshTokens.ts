import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CreateRefreshTokens1615085396840
  implements MigrationInterface {
  name = 'CreateRefreshTokens1615085396840';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "access_token" character varying NOT NULL, "refresh_token" character varying NOT NULL, "user_id" uuid NOT NULL, "expires_in" integer NOT NULL, "is_active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f5d31d5d15aa35d3857a578916e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Refresh_tokens" ADD CONSTRAINT "FK_5e239593d4e79711846c0252f5a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Refresh_tokens" DROP CONSTRAINT "FK_5e239593d4e79711846c0252f5a"`,
    );
    await queryRunner.query(`DROP TABLE "Refresh_tokens"`);
  }
}
