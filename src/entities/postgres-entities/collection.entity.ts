import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NetworkTypeEnum } from '@models/enums/netwok.enum';
import {
  CollectionTypeEnum,
  CollectionStatusEnum,
} from '@models/enums/collection.enum';

@Index('collections_address_idx', ['address'], { unique: true })
@Entity('collections')
export class CollectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    name: 'banner_image',
  })
  bannerImage: string;

  @Column()
  logo: string;

  @Column({
    name: 'network_type',
    type: 'enum',
    enum: NetworkTypeEnum,
    default: NetworkTypeEnum.ALEO,
  })
  networkType: NetworkTypeEnum;

  @Column({
    name: 'creator_id',
  })
  creatorId: string;

  @Column({
    name: 'collection_type',
    type: 'enum',
    enum: CollectionTypeEnum,
    default: CollectionTypeEnum.ERC721,
  })
  collectionType: CollectionTypeEnum;

  @Column({
    name: 'royalty_fee',
  })
  royaltyFee: number;

  @Column({
    name: 'discord_url',
  })
  discordUrl: string;

  @Column({
    name: 'twitter_url',
  })
  twitterUrl: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: CollectionStatusEnum,
    default: CollectionStatusEnum.UNVERIFIED,
  })
  status: CollectionStatusEnum;

  @Column({
    name: 'owners',
  })
  owners: number;

  @Column({
    name: 'total_items',
  })
  totalItems: number;

  @Column({
    name: 'last_run',
  })
  lastRun: number;

  @Column({
    name: 'analyze_status',
    default: -1,
  })
  analyzeStatus: number;

  @Column({
    name: 'verify_type',
  })
  verifyType: number;

  @Column({
    name: 'floor_price',
  })
  floor_price: string;

  @CreateDateColumn({
    name: 'time_listing',
  })
  timeListing: Date;

  @Column({
    name: 'mint_time',
  })
  mintTime: number;

  @Column({
    name: 'onchain_type',
  })
  onchainType: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
