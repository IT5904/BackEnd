import {MigrationInterface, QueryRunner} from "typeorm";

export class updateToolAccount1684133423910 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tool_wallet_balance" 
            ADD COLUMN toce_balance numeric(32) NULL DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tool_wallet_balance" 
            DROP COLUMN toce_balance
        `);
    }
}
