import { CollectionActivityTypeEnum } from './../../models/enums/collection.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('collection-activity')
@Index('collection_activity_collection_address_idx', ['collectionAddress'], {})
@Index('collection_activity_from_address_idx', ['fromAddress'], {})
@Index('collection_activity_timestamp_idx', ['timestamp'], {})
@Index('collection_activity_user_address_idx', ['userAddress'], {})
export class CollectionActivityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'collection_id' })
  collectionId: number;

  @Column({
    name: 'nft_id',
  })
  nftId: number;

  @Column({ name: 'collection_address' })
  collectionAddress: string;

  @Column({
    name: 'nft_address',
  })
  nftAddress: string;

  @Column({
    name: 'from_address',
  })
  fromAddress: string;

  @Column({
    name: 'activity',
    type: 'enum',
    enum: CollectionActivityTypeEnum,
  })
  activity: CollectionActivityTypeEnum;

  @Column({
    name: 'transaction_id',
  })
  transactionId: string;

  @Column({
    name: 'timestamp',
  })
  timestamp: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({
    name: 'user_address',
  })
  userAddress: string;

  @Column({
    name: 'price',
  })
  price: number;

  @Column({
    name: 'expire_time',
  })
  expireTime: number;

  @Column({
    name: 'quantity',
    default: 1,
  })
  quantity: number;

  @Column({ name: 'block_timestamp', type: 'bigint', nullable: true })
  blockTimestamp: number;

  @Column({ name: 'start_time' })
  startTime: number;
}
