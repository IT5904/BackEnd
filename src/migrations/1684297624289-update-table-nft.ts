import {MigrationInterface, QueryRunner} from "typeorm";

export class updateTableNft1684297624289 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "nfts" 
            ADD COLUMN rarity_type varchar(20) NULL DEFAULT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "nfts" 
            ADD COLUMN ranking int4 NULL DEFAULT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "nft" 
            DROP COLUMN rarity_type
        `);
        await queryRunner.query(`
            ALTER TABLE "nft" 
            DROP COLUMN ranking
        `);
    }

}
