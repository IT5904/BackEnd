import { SaleTypeEnum, SaleStatusEnum } from '@models/enums/sale-nft-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index('nfts_block_timestamp_idx', ['blockTimestamp'], {})
@Index('nfts_collection_address_idx', ['collectionAddress'], {})
@Index('nfts_listing_price_idx', ['listingPrice'], {})
@Index('nfts_nft_address_idx', ['nftAddress'], {})
@Index('nfts_nft_status_idx', ['nftStatus'], {})
@Index('nfts_owner_address_idx', ['ownerAddress'], {})
@Entity('nfts')
export class NftEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    name: 'nft_address',
  })
  nftAddress: string;

  @Column({
    name: 'collection_id',
  })
  collectionId: number;

  @Column({
    name: 'collection_address',
  })
  collectionAddress: string;

  @Column()
  description: string;

  @Column({
    name: 'max_quantity',
  })
  maxQuantity: number;

  @Column({
    name: 'image_url',
  })
  imageUrl: string;

  @Column({
    name: 'creator_address',
  })
  creatorAddress: string;

  @Column({
    name: 'owner_address',
  })
  ownerAddress: string;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: true,
  })
  properties!: Array<{ key: string; value: string }>;

  @Column({
    name: 'external_link',
  })
  externalLink: string;

  @Column({
    name: 'expire_time',
    type: 'int',
  })
  expireTime: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({
    name: 'nft_status',
    type: 'enum',
    enum: SaleStatusEnum,
    default: SaleStatusEnum.CANCEL,
  })
  nftStatus: SaleStatusEnum;

  @Column({
    name: 'start_price',
    type: 'decimal',
  })
  startPrice: string;

  @Column({
    name: 'end_price',
    type: 'decimal',
  })
  endPrice: string;

  @Column({
    name: 'price',
    type: 'decimal',
  })
  price: string;

  @Column({
    name: 'market_price',
    type: 'decimal',
  })
  marketPrice: string;

  @Column({
    name: 'listing_price',
    type: 'decimal',
  })
  listingPrice: string;

  @Column({
    name: 'offer_price',
    type: 'decimal',
  })
  offerPrice: string;

  @Column({
    name: 'quantity',
  })
  quantity: number;

  @Column({
    name: 'sale_type',
    type: 'enum',
    enum: SaleTypeEnum,
    default: SaleTypeEnum.FIX_PRICE,
  })
  saleType: SaleTypeEnum;

  @Column({
    name: 'reserve_buyer_id',
  })
  reserveBuyer: number;

  @Column({ name: 'start_time' })
  startTime: number;

  @Column({ name: 'block_timestamp', type: 'bigint', nullable: true })
  blockTimestamp: number;

  @Column({ name: 'verify' })
  verify: number;

  @Column({ name: 'version', nullable: true })
  version: number;

  @Column({
    name: 'count_react',
  })
  countReact: number;

  @Column({
    name: 'rarity_type',
  })
  rarityType: string;

  @Column({
    name: 'ranking',
  })
  ranking: number;
}
