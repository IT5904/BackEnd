import {MigrationInterface, QueryRunner} from "typeorm";

export class createTableToolWalletBalance1682669388852 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tool_wallet_balance" ("id" BIGSERIAL PRIMARY KEY, "wallet_address" TEXT , "coin" TEXT , "balance" NUMERIC(32), "created_at" TIMESTAMP, "updated_at" TIMESTAMP)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tool_wallet_balance"`);
    }

}
