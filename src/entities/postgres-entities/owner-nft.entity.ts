import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('owner-nft')
export class OwnerNftEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    name: 'nft_id',
  })
  nftId: number;

  @Column({
    name: 'nft_address',
  })
  nftAddress: string;

  @Column({
    name: 'user_id',
  })
  userId: number;

  @Column({
    name: 'user_address',
  })
  userAddress: string;

  @Column({
    name: 'remain_amount',
  })
  remainAmount: number;

  @Column({
    name: 'off_sale_amount',
  })
  offSaleAmount: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
