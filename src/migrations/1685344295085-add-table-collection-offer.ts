import {MigrationInterface, QueryRunner} from "typeorm";

export class addTableCollectionOffer1685344295085 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "collection_offer" ("id" BIGSERIAL PRIMARY KEY, "user_address" TEXT NOT NULL, "collection_address" TEXT NOT NULL, "price" NUMERIC(32), "status" SMALLINT, "quantity" NUMERIC(32), "block_timestamp" BIGINT, "expire_time" BIGINT, "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "collection_offer"`);
    }

}
