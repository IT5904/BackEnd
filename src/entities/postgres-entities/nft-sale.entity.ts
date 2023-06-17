import { SaleTypeEnum, SaleStatusEnum } from '@models/enums/sale-nft-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('nft-sale')
export class NftSaleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'start_time' })
  startTime: number;

  @Column({
    name: 'nft_id',
  })
  nftId: number;

  @Column({
    name: 'user_id',
  })
  userId: number;

  @Column()
  price: string;

  @Column({
    name: 'start_price',
  })
  startPrice: string;

  @Column({
    name: 'end_price',
  })
  endPrice: string;

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
    name: 'status',
    type: 'enum',
    enum: SaleStatusEnum,
    default: SaleStatusEnum.LISTING,
  })
  status: SaleStatusEnum;

  @Column({
    name: 'reserve_buyer_id',
  })
  reserveBuyer: number;

  @Column({
    name: 'expire_time',
    type: 'int',
  })
  expireTime: number;

  @Column({ name: 'block_timestamp', type: 'bigint', nullable: true })
  blockTimestamp: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
