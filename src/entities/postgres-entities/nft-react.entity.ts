import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index('nft_react_nft_address_idx', ['nftAddress'], {})
@Entity('nft-react')
export class NftReactEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'nft_address',
  })
  nftAddress: string;

  @Column({
    name: 'user_address',
  })
  userAddress: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
