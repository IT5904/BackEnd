import {MigrationInterface, QueryRunner} from "typeorm";

export class updateTableMarketNotice1684469244900 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "marketplace_notice" 
            ADD COLUMN owner_action int4 NULL DEFAULT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "marketplace_notice" 
            DROP COLUMN owner_action
        `);
    }

}
