import {MigrationInterface, QueryRunner} from "typeorm";

export class updateTableNftOffer1682650294670 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "nfts" 
            ADD COLUMN version int NULL DEFAULT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "offer-sale" 
            ADD COLUMN version int NULL DEFAULT NULL
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "nfts" 
            DROP COLUMN version
        `);
        await queryRunner.query(`
            ALTER TABLE "offer-sale" 
            DROP COLUMN version
        `);
      }

}
