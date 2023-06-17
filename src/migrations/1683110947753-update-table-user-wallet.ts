import {MigrationInterface, QueryRunner} from "typeorm";

export class updateTableUserWallet1683110947753 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user-wallet" 
            ADD COLUMN signature text NULL DEFAULT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user-wallet" 
            DROP COLUMN signature
        `);
    }

}
