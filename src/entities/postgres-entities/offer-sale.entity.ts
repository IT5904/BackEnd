import { OfferSaleStatusEnum } from '@models/enums/sale-nft-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index('offer-sale_pkey', ['id'], { unique: true })
@Entity('offer-sale')
export class OfferSaleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'start_time' })
  startTime: number;

  @Column({ name: 'expire_time' })
  expireTime: number;

  @Column({
    name: 'nft_id',
  })
  nftId: number;

  @Column({
    name: 'nft_address',
  })
  nftAddress: string;

  @Column({
    name: 'nft_sale_id',
  })
  nftSaleId: string;

  @Column({
    name: 'user_address',
  })
  userAddress: string;

  @Column()
  price: string;

  @Column({
    name: 'quantity',
    default: 1,
  })
  quantity: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: OfferSaleStatusEnum,
    default: OfferSaleStatusEnum.NOT_ACCEPTED,
  })
  status: OfferSaleStatusEnum;

  @Column({ name: 'block_timestamp', type: 'bigint', nullable: true })
  blockTimestamp: number;

  @Column({ name: 'version', nullable: true })
  version: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
