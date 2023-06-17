import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index('nft_properties_collection_address_idx', ['collectionId'], {})
@Index('nft_properties_key_idx', ['key', 'value'], {})
@Index('nft_properties_nft_address_idx', ['nftId'], {})
@Entity('nft_properties')
export class NftPropertiesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nft_address' })
  nftId: string;

  @Column({ name: 'collection_address' })
  collectionId: string;

  @Column()
  key: string;

  @Column()
  value: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
