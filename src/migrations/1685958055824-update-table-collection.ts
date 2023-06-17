import {MigrationInterface, QueryRunner} from "typeorm";

export class updateTableCollection1685958055824 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "collections" 
            ADD COLUMN onchain_type text NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "collections" 
            DROP COLUMN onchain_type
        `);
    }

}
