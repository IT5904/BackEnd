import { OfferSaleStatusEnum } from '@models/enums/sale-nft-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('collection_offer')
export class CollectionOfferEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'expire_time' })
  expireTime: number;

  @Column({ name: 'version' })
  version: number;

  @Column({
    name: 'collection_address',
  })
  collectionAddress: string;

  @Column({
    name: 'user_address',
  })
  userAddress: string;

  @Column()
  price: number;

  @Column({
    name: 'quantity',
  })
  quantity: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: OfferSaleStatusEnum,
    default: 1,
  })
  status: OfferSaleStatusEnum;

  @Column({ name: 'block_timestamp', type: 'bigint', nullable: true })
  blockTimestamp: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
