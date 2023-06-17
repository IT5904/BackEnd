import {MigrationInterface, QueryRunner} from "typeorm";

export class updateTimeListingCollecion1683598656420 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "collections" 
            ADD COLUMN time_listing timestamp NULL DEFAULT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "collections" 
            DROP COLUMN time_listing
        `);
    }

}
