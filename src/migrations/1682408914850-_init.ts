import {MigrationInterface, QueryRunner} from "typeorm";

export class undefinednit1682408914850 implements MigrationInterface {
    name = 'undefinednit1682408914850'

    public async up(queryRunner: QueryRunner): Promise<void> {
       // await queryRunner.query(`CREATE TYPE "chain-url_status_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "chain-url" ("id" bigserial , "chain_url" character varying , "client_status" integer  DEFAULT '0', "total_txn" integer  DEFAULT '0', "response_time" integer , "env" character varying , "status" integer  DEFAULT '0', "created_at" TIMESTAMP  DEFAULT now(), "updated_at" TIMESTAMP  DEFAULT now(), CONSTRAINT "PK_aca6d173c132a8d65c25eec3a35" PRIMARY KEY ("id"))`);
       // await queryRunner.query(`CREATE TYPE "collection-activity_activity_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8')`);
        await queryRunner.query(`CREATE TABLE "collection-activity" (
            id bigserial NOT NULL,
            collection_id int4 NULL,
            nft_id int4 NULL,
            activity int2 NOT NULL DEFAULT 0,
            transaction_id varchar NULL,
            created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "timestamp" int8 NULL,
            user_address varchar NULL,
            price numeric(32) NULL,
            expire_time int8 NULL,
            quantity int4 NOT NULL DEFAULT 1,
            block_timestamp int8 NULL,
            start_time int8 NULL,
            from_address varchar NULL,
            nft_address varchar NULL,
            collection_address varchar NULL,
            CONSTRAINT "PK_2731e7bfa5a495bc7a8e842cd90" PRIMARY KEY (id)
        )`);
        await queryRunner.query(`CREATE INDEX "collection_activity_user_address_idx" ON "collection-activity" ("user_address") `);
        await queryRunner.query(`CREATE INDEX "collection_activity_timestamp_idx" ON "collection-activity" ("timestamp") `);
        await queryRunner.query(`CREATE INDEX "collection_activity_from_address_idx" ON "collection-activity" ("from_address") `);
        await queryRunner.query(`CREATE INDEX "collection_activity_collection_address_idx" ON "collection-activity" ("collection_address") `);
        await queryRunner.query(`CREATE TABLE "collection_properties" ("id" bigserial , "collection_address" character varying , "properties" character varying , "created_at" TIMESTAMP  DEFAULT now(), "updated_at" TIMESTAMP  DEFAULT now(), CONSTRAINT "PK_69053983a3e57af4f16ac90fd6a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE collection_volume_by_h (
            id bigserial NOT NULL,
            collection_id int4 NULL,
            collection_address varchar NULL,
            floor_price_1h numeric(32) NULL,
            floor_price_1d numeric(32) NULL,
            floor_price_7d numeric(32) NULL,
            floor_price_1m numeric(32) NULL,
            volume_1h numeric(32) NULL,
            volume_1d numeric(32) NULL,
            volume_7d numeric(32) NULL,
            volume_1m numeric(32) NULL,
            total_volume numeric(32) NULL,
            floor_price numeric(32) NULL,
            percentage_volume_1h numeric(32) NULL,
            percentage_volume_1d numeric(32) NULL,
            percentage_volume_7d numeric(32) NULL,
            percentage_volume_1m numeric(32) NULL,
            percentage_floor_1h numeric(32) NULL,
            percentage_floor_1d numeric(32) NULL,
            percentage_floor_7d numeric(32) NULL,
            percentage_floor_1m numeric(32) NULL,
            prev_volume numeric(32) NULL,
            sales_1h numeric(32) NULL,
            sales_1d numeric(32) NULL,
            sales_7d numeric(32) NULL,
            sales_1m numeric(32) NULL,
            total_sales numeric(32) NULL,
            percentage_sales_1h numeric(32) NULL,
            percentage_sales_1d numeric(32) NULL,
            percentage_sales_7d numeric(32) NULL,
            percentage_sales_1m numeric(32) NULL,
            log_timestamp int8 NULL,
            created_at timestamp NULL DEFAULT now(),
            updated_at timestamp NULL DEFAULT now(),
            CONSTRAINT "PK_9da8487ddbc3321d05380c39093" PRIMARY KEY (id)
        )`);
        await queryRunner.query(`CREATE INDEX "collection_volume_by_h_log_timestamp_idx" ON "collection_volume_by_h" ("log_timestamp") `);
        await queryRunner.query(`CREATE INDEX "collection_volume_by_h_collection_address_idx" ON "collection_volume_by_h" ("collection_address") `);
        await queryRunner.query(`CREATE TABLE "collection_volume" ("id" bigserial , "collection_id" integer , "collection_address" character varying , "floor_price_1h" numeric(32) , "floor_price_1d" numeric(32) , "floor_price_7d" numeric(32) , "floor_price_1m" numeric(32) , "volume_1h" numeric(32) , "volume_1d" numeric(32) , "volume_7d" numeric(32) , "volume_1m" numeric(32) , "total_volume" numeric(32) , "floor_price" numeric(32) , "percentage_volume_1h" numeric(32) , "percentage_volume_1d" numeric(32) , "percentage_volume_7d" numeric(32) , "percentage_volume_1m" numeric(32) , "percentage_floor_1h" numeric(32) , "percentage_floor_1d" numeric(32) , "percentage_floor_7d" numeric(32) , "percentage_floor_1m" numeric(32) , "prev_volume" numeric(32) , "sales_1h" numeric(32) , "sales_1d" numeric(32) , "sales_7d" numeric(32) , "sales_1m" numeric(32) , "total_sales" numeric(32) , "percentage_sales_1h" numeric(32) , "percentage_sales_1d" numeric(32) , "percentage_sales_7d" numeric(32) , "percentage_sales_1m" numeric(32) , "created_at" TIMESTAMP  DEFAULT now(), "updated_at" TIMESTAMP  DEFAULT now(), CONSTRAINT "PK_0acdf25c9c9de5506881120bb1b" PRIMARY KEY ("id"))`);
      //  await queryRunner.query(`CREATE TYPE "collections_network_type_enum" AS ENUM('0', '1')`);
       // await queryRunner.query(`CREATE TYPE "collections_collection_type_enum" AS ENUM('0', '1')`);
      //  await queryRunner.query(`CREATE TYPE "collections_status_enum" AS ENUM('-1', '0', '1')`);
        await queryRunner.query(`CREATE TABLE "collections" ("id" bigserial , "address" character varying , "name" character varying , "description" character varying , "banner_image" character varying , "logo" character varying , "network_type" int2  DEFAULT '0', "creator_id" character varying , "collection_type" int2  DEFAULT '0', "royalty_fee" integer , "discord_url" character varying , "twitter_url" character varying , "status" int2  DEFAULT '0', "owners" integer , "total_items" integer , "last_run" integer , "analyze_status" integer  DEFAULT '-1', "verify_type" integer , "floor_price" character varying , "created_at" TIMESTAMP  DEFAULT now(), "updated_at" TIMESTAMP  DEFAULT now(), CONSTRAINT "PK_21c00b1ebbd41ba1354242c5c4e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "collections_address_idx" ON "collections" ("address") `);
        await queryRunner.query(`
        CREATE TABLE "crawler-status" (
            id bigserial NOT NULL,
            contract_name varchar NULL,
            contract_address varchar NULL,
            tx_digest varchar NULL,
            module_name varchar NULL,
            "type" varchar NULL,
            mint_function varchar NULL,
            object_type varchar NULL,
            is_enable bool NULL,
            block_timestamp int8 NULL,
            event_num_in_one_go int4 NULL DEFAULT 100,
            event_seq int4 NULL,
            mint_event varchar NULL,
            created_at timestamp NULL DEFAULT now(),
            updated_at timestamp NULL DEFAULT now(),
            CONSTRAINT "PK_d754bbc3aa49c25f02147c3df6f" PRIMARY KEY (id)
        )
        `);
      //  await queryRunner.query(`CREATE TABLE "user-tests" ("id" SERIAL , "name" character varying , "email" character varying , "created_at" TIMESTAMP , "updated_at" TIMESTAMP , CONSTRAINT "PK_7df9e081dc1fc7498220e352d9f" PRIMARY KEY ("id"))`);
       // await queryRunner.query(`CREATE TYPE "user-wallet_network_type_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "user-wallet" ("id" BIGSERIAL , "user_id" bigint , "network_type" int2  DEFAULT '0', "address" character varying , "ip_address" character varying , "created_at" TIMESTAMP  DEFAULT now(), "updated_at" TIMESTAMP  DEFAULT now(), CONSTRAINT "PK_b2c7ef32a8eea816d7cff4e14a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "user_wallet_user_id_idx" ON "user-wallet" ("user_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "user_wallet_address_idx" ON "user-wallet" ("address") `);
        await queryRunner.query(`
        CREATE TABLE "user-info" (
            id bigserial NOT NULL,
            email varchar(50) NULL,
            "name" varchar(50) NULL,
            discord_url varchar NULL,
            twitter_url varchar NULL,
            avatar_url varchar NULL,
            cover_url varchar NULL,
            created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            ip_address varchar(50) NULL,
            website_url varchar NULL,
            twitter_verify int2 NULL,
            discord_verify int2 NULL,
            update_timestamp int8 NULL,
            CONSTRAINT "PK_17470eb7d3fd325d9c872551fc6" PRIMARY KEY (id)
        )`);
        await queryRunner.query(`CREATE INDEX "user_info_update_timestamp_idx" ON "user-info" ("update_timestamp") `);
        await queryRunner.query(`CREATE INDEX "user_info_twitter_url_idx" ON "user-info" ("twitter_url") `);
        await queryRunner.query(`CREATE TABLE "user-watchlist" ("id" bigserial , "user_address" character varying , "collection_address" character varying , "created_at" TIMESTAMP  DEFAULT now(), "updated_at" TIMESTAMP  DEFAULT now(), CONSTRAINT "PK_03bb2a5b03e995131c54c573b2a" PRIMARY KEY ("id"))`);
      //  await queryRunner.query(`CREATE TYPE "nfts_nft_status_enum" AS ENUM('-1', '0', '1', '2', '3')`);
      //  await queryRunner.query(`CREATE TYPE "nfts_sale_type_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "nfts" ("id" BIGSERIAL , "title" character varying , "nft_address" varchar , "collection_id" integer , "collection_address" varchar , "description" character varying , "max_quantity" integer , "image_url" character varying , "creator_address" varchar , "owner_address" varchar , "properties" jsonb DEFAULT '[]', "external_link" character varying , "expire_time" bigint , "created_at" TIMESTAMP  DEFAULT now(), "updated_at" TIMESTAMP  DEFAULT now(), "nft_status" int2  DEFAULT '1', "start_price" numeric(32) , "end_price" numeric(32) , "price" numeric(32) , "market_price" numeric(32) , "listing_price" numeric(32) , "offer_price" numeric(32) , "quantity" integer , "sale_type" int2  DEFAULT '0', "reserve_buyer_id" integer , "start_time" bigint , "block_timestamp" bigint, "verify" integer , "count_react" integer , CONSTRAINT "PK_65562dd9630b48c4d4710d66772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "nfts_owner_address_idx" ON "nfts" ("owner_address") `);
        await queryRunner.query(`CREATE INDEX "nfts_nft_status_idx" ON "nfts" ("nft_status") `);
        await queryRunner.query(`CREATE INDEX "nfts_nft_address_idx" ON "nfts" ("nft_address") `);
        await queryRunner.query(`CREATE INDEX "nfts_listing_price_idx" ON "nfts" ("listing_price") `);
        await queryRunner.query(`CREATE INDEX "nfts_collection_address_idx" ON "nfts" ("collection_address") `);
        await queryRunner.query(`CREATE INDEX "nfts_block_timestamp_idx" ON "nfts" ("block_timestamp") `);
      //  await queryRunner.query(`CREATE TYPE "nft-sale_sale_type_enum" AS ENUM('0', '1')`);
      //  await queryRunner.query(`CREATE TYPE "nft-sale_status_enum" AS ENUM('-1', '0', '1', '2', '3')`);
       // await queryRunner.query(`CREATE TABLE "nft-sale" ("id" bigserial  DEFAULT uuid_generate_v4(), "start_time" integer , "nft_id" integer , "user_id" integer , "price" character varying , "start_price" character varying , "end_price" character varying , "quantity" integer , "sale_type" int2  DEFAULT '0', "status" int2  DEFAULT '0', "reserve_buyer_id" integer , "expire_time" integer , "block_timestamp" bigint, "created_at" TIMESTAMP  DEFAULT now(), "updated_at" TIMESTAMP  DEFAULT now(), CONSTRAINT "PK_725ea1a754fc3f157d378772bae" PRIMARY KEY ("id"))`);
        
      //  await queryRunner.query(`CREATE TYPE "offer-sale_status_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`
        CREATE TABLE "offer-sale" (
            id bigserial NOT NULL,
            nft_id int8 NOT NULL,
            nft_sale_id uuid NULL,
            price numeric(32) NOT NULL DEFAULT 0,
            quantity int4 NOT NULL,
            status int2 NOT NULL DEFAULT 1,
            expire_time int8 NULL,
            start_time int8 NULL,
            block_timestamp int8 NULL,
            created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            user_address varchar NOT NULL,
            nft_address varchar NULL,
            CONSTRAINT "offer-sale_pkey" PRIMARY KEY (id)
        )
        `);
      //  await queryRunner.query(`CREATE UNIQUE INDEX "offer-sale_pkey" ON "offer-sale" ("id") `);
       // await queryRunner.query(`CREATE TABLE "owner-nft" ("id" SERIAL , "nft_id" integer , "nft_address" character varying , "user_id" integer , "user_address" character varying , "remain_amount" integer , "off_sale_amount" integer , "created_at" TIMESTAMP  DEFAULT now(), "updated_at" TIMESTAMP  DEFAULT now(), CONSTRAINT "PK_466071eacf4be16863e28a61188" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "nft_properties" ("id" bigserial , "nft_address" character varying , "collection_address" character varying , "key" character varying , "value" character varying , "created_at" TIMESTAMP  DEFAULT now(), "updated_at" TIMESTAMP  DEFAULT now(), CONSTRAINT "PK_6fcbccd880c6dd3b1e31baaf836" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "nft_properties_nft_address_idx" ON "nft_properties" ("nft_address") `);
        await queryRunner.query(`CREATE INDEX "nft_properties_key_idx" ON "nft_properties" ("key", "value") `);
        await queryRunner.query(`CREATE INDEX "nft_properties_collection_address_idx" ON "nft_properties" ("collection_address") `);
        await queryRunner.query(`CREATE TABLE "nft-react" ("id" bigserial , "nft_address" character varying , "user_address" character varying , "created_at" TIMESTAMP  DEFAULT now(), "updated_at" TIMESTAMP  DEFAULT now(), CONSTRAINT "PK_41d57075bd8d64f9253edc57fc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "nft_react_nft_address_idx" ON "nft-react" ("nft_address") `);
      //  await queryRunner.query(`CREATE TYPE "job-manage_status_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "job-manage" ("id" bigserial , "contract_name" character varying , "contract_address" character varying , "status" int2 , "type" character varying , "job_name" character varying , "created_at" TIMESTAMP  DEFAULT now(), "updated_at" TIMESTAMP  DEFAULT now(), CONSTRAINT "PK_90aa0e477cbfa23b6bf174697d5" PRIMARY KEY ("id"))`);
     //   await queryRunner.query(`CREATE TYPE "marketplace_notice_type_enum" AS ENUM('0')`);
      //  await queryRunner.query(`CREATE TYPE "marketplace_notice_sub_type_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8')`);
        await queryRunner.query(`CREATE TABLE "marketplace_notice" ("id" bigserial , "type" int2  DEFAULT '0', "sub_type" int2  DEFAULT '1', "owner" character varying , "operator" character varying , "content" character varying , "is_read" integer  DEFAULT '0', "image" character varying , "name" character varying , "deleted" integer  DEFAULT '0', "price" numeric(32)  DEFAULT '0', "nft_address" character varying , "collection_address" character varying , "timestamp" bigint , "created_at" TIMESTAMP  DEFAULT now(), "updated_at" TIMESTAMP  DEFAULT now(), CONSTRAINT "PK_5060f42615a0ebb03319fe1b896" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "marketplace_notice_timestamp_idx" ON "marketplace_notice" ("timestamp") `);
        await queryRunner.query(`CREATE INDEX "marketplace_notice_owner_idx" ON "marketplace_notice" ("owner") `);
        await queryRunner.query(`CREATE TABLE "tocen_user_discord" ("id" bigserial , "discord_id" character varying , "bot" boolean , "system" boolean , "flags" integer , "username" character varying , "avatar" character varying , "discriminator" character varying , "verified" boolean , "mfa_enabled" boolean , "created_timestamp" bigint , "default_avatar_url" character varying , "tag" character varying , "avatar_url" character varying , "display_avatar_url" character varying , "created_at" TIMESTAMP  DEFAULT now(), "updated_at" TIMESTAMP  DEFAULT now(), CONSTRAINT "PK_cd76c0b89e3a78d1aaf8543f571" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "tocen_user_discord_tag_idx" ON "tocen_user_discord" ("tag") `);
        await queryRunner.query(`CREATE INDEX "tocen_user_discord_discord_id_idx" ON "tocen_user_discord" ("discord_id") `);
        await queryRunner.query(`CREATE TABLE "tocen_user_twitter" ("id" bigserial , "sortindex" integer , "timestamp" bigint , "username" character varying , "created_at" TIMESTAMP  DEFAULT now(), "updated_at" TIMESTAMP  DEFAULT now(), CONSTRAINT "PK_4ff15379c0d022d790d274f8cb1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "tocen_user_twitter_username_idx" ON "tocen_user_twitter" ("username") `);
        await queryRunner.query(`CREATE INDEX "tocen_user_twitter_sortindex_idx" ON "tocen_user_twitter" ("sortindex") `);
        await queryRunner.query(`CREATE TABLE "tocen_wait_verify_twitter" ("id" bigserial , "timestamp" bigint , "twitter_name" character varying , "created_at" TIMESTAMP  DEFAULT now(), "updated_at" TIMESTAMP  DEFAULT now(), CONSTRAINT "PK_60e7736b459de64f6ca5c7a1f1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "system_jobs" ("id" bigserial , "created_at" TIMESTAMP  DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP  DEFAULT CURRENT_TIMESTAMP, "current_logid" bigint, "jobid" integer, "current_timestamp" bigint, "jobdescription" varchar, "job_name" varchar, "next_cursor" varchar, CONSTRAINT "PK_9bd79ea599c52d077c5797293f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."tocen_user_twitter_top_list" ("id" BIGSERIAL , "sortindex" bigint, "username" varchar, "created_at" TIMESTAMP  DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP  DEFAULT CURRENT_TIMESTAMP, "timestamp" bigint, "next_cursor" varchar, CONSTRAINT "PK_611061bdd6849592ea53235d1bd" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "public"."tocen_user_twitter_top_list"`);
        await queryRunner.query(`DROP TABLE "system_jobs"`);
        await queryRunner.query(`DROP TABLE "tocen_wait_verify_twitter"`);
        await queryRunner.query(`DROP INDEX "tocen_user_twitter_sortindex_idx"`);
        await queryRunner.query(`DROP INDEX "tocen_user_twitter_username_idx"`);
        await queryRunner.query(`DROP TABLE "tocen_user_twitter"`);
        await queryRunner.query(`DROP INDEX "tocen_user_discord_discord_id_idx"`);
        await queryRunner.query(`DROP INDEX "tocen_user_discord_tag_idx"`);
        await queryRunner.query(`DROP TABLE "tocen_user_discord"`);
        await queryRunner.query(`DROP INDEX "marketplace_notice_owner_idx"`);
        await queryRunner.query(`DROP INDEX "marketplace_notice_timestamp_idx"`);
        await queryRunner.query(`DROP TABLE "marketplace_notice"`);
       // await queryRunner.query(`DROP TYPE "marketplace_notice_sub_type_enum"`);
       // await queryRunner.query(`DROP TYPE "marketplace_notice_type_enum"`);
        await queryRunner.query(`DROP TABLE "job-manage"`);
       // await queryRunner.query(`DROP TYPE "job-manage_status_enum"`);
        await queryRunner.query(`DROP INDEX "nft_react_nft_address_idx"`);
        await queryRunner.query(`DROP TABLE "nft-react"`);
        await queryRunner.query(`DROP INDEX "nft_properties_collection_address_idx"`);
        await queryRunner.query(`DROP INDEX "nft_properties_key_idx"`);
        await queryRunner.query(`DROP INDEX "nft_properties_nft_address_idx"`);
        await queryRunner.query(`DROP TABLE "nft_properties"`);
       // await queryRunner.query(`DROP TABLE "owner-nft"`);
        await queryRunner.query(`DROP TABLE "offer-sale"`);
       // await queryRunner.query(`DROP TYPE "offer-sale_status_enum"`);
       // await queryRunner.query(`DROP TABLE "nft-sale"`);
       // await queryRunner.query(`DROP TYPE "nft-sale_status_enum"`);
        //await queryRunner.query(`DROP TYPE "nft-sale_sale_type_enum"`);
        await queryRunner.query(`DROP INDEX "nfts_block_timestamp_idx"`);
        await queryRunner.query(`DROP INDEX "nfts_collection_address_idx"`);
        await queryRunner.query(`DROP INDEX "nfts_listing_price_idx"`);
        await queryRunner.query(`DROP INDEX "nfts_nft_address_idx"`);
        await queryRunner.query(`DROP INDEX "nfts_nft_status_idx"`);
        await queryRunner.query(`DROP INDEX "nfts_owner_address_idx"`);
        await queryRunner.query(`DROP TABLE "nfts"`);
       // await queryRunner.query(`DROP TYPE "nfts_sale_type_enum"`);
        //await queryRunner.query(`DROP TYPE "nfts_nft_status_enum"`);
        await queryRunner.query(`DROP TABLE "user-watchlist"`);
        await queryRunner.query(`DROP INDEX "user_info_twitter_url_idx"`);
        await queryRunner.query(`DROP INDEX "user_info_update_timestamp_idx"`);
        await queryRunner.query(`DROP TABLE "user-info"`);
        await queryRunner.query(`DROP INDEX "user_wallet_address_idx"`);
        await queryRunner.query(`DROP INDEX "user_wallet_user_id_idx"`);
        await queryRunner.query(`DROP TABLE "user-wallet"`);
        //await queryRunner.query(`DROP TYPE "user-wallet_network_type_enum"`);
       // await queryRunner.query(`DROP TABLE "user-tests"`);
        await queryRunner.query(`DROP TABLE "crawler-status"`);
        await queryRunner.query(`DROP INDEX "collections_address_idx"`);
        await queryRunner.query(`DROP TABLE "collections"`);
       // await queryRunner.query(`DROP TYPE "collections_status_enum"`);
        //await queryRunner.query(`DROP TYPE "collections_collection_type_enum"`);
        //await queryRunner.query(`DROP TYPE "collections_network_type_enum"`);
        await queryRunner.query(`DROP TABLE "collection_volume"`);
        await queryRunner.query(`DROP INDEX "collection_volume_by_h_collection_address_idx"`);
        await queryRunner.query(`DROP INDEX "collection_volume_by_h_log_timestamp_idx"`);
        await queryRunner.query(`DROP TABLE "collection_volume_by_h"`);
        await queryRunner.query(`DROP TABLE "collection_properties"`);
        await queryRunner.query(`DROP INDEX "collection_activity_collection_address_idx"`);
        await queryRunner.query(`DROP INDEX "collection_activity_from_address_idx"`);
        await queryRunner.query(`DROP INDEX "collection_activity_timestamp_idx"`);
        await queryRunner.query(`DROP INDEX "collection_activity_user_address_idx"`);
        await queryRunner.query(`DROP TABLE "collection-activity"`);
        //await queryRunner.query(`DROP TYPE "collection-activity_activity_enum"`);
        await queryRunner.query(`DROP TABLE "chain-url"`);
       // await queryRunner.query(`DROP TYPE "chain-url_status_enum"`);
    }

}
