import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordFieldToUsers1672964454184
  implements MigrationInterface
{
  name = 'AddPasswordFieldToUsers1672964454184';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "password" character varying(64) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
  }
}
