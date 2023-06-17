import {MigrationInterface, QueryRunner} from "typeorm";

export class updateTableTocenUserTwitter1682675973898 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tocen_user_twitter" 
            ADD COLUMN twitter_id text NULL DEFAULT NULL
        `);

        await queryRunner.query(`
            ALTER TABLE "tocen_user_twitter" 
            ADD COLUMN access_token text NULL DEFAULT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "tocen_user_twitter" 
            ADD COLUMN name text NULL DEFAULT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tocen_user_twitter" 
            DROP COLUMN twitter_id
        `);
        await queryRunner.query(`
            ALTER TABLE "tocen_user_twitter" 
            DROP COLUMN access_token
        `);
        await queryRunner.query(`
            ALTER TABLE "tocen_user_twitter" 
            DROP COLUMN name
        `);
    }

}
