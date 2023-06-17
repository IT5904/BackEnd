import {MigrationInterface, QueryRunner} from "typeorm";

export class updateTableCollection1685011556126 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "collections" 
            ADD COLUMN mint_time bigint NULL DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "collections" 
            DROP COLUMN mint_time
        `);
    }

}
