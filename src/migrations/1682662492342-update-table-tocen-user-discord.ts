import {MigrationInterface, QueryRunner} from "typeorm";

export class updateTableTocenUserDiscord1682662492342 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tocen_user_discord" 
            ADD COLUMN access_token text NULL DEFAULT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "tocen_user_discord" 
            ADD COLUMN refresh_token text NULL DEFAULT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tocen_user_discord" 
            DROP COLUMN access_token
        `);
        await queryRunner.query(`
            ALTER TABLE "tocen_user_discord" 
            DROP COLUMN refresh_token
        `);
    }

}
