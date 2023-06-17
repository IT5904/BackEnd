import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user-watchlist')
export class UserWatchlistEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'user_address',
  })
  userAddress: string;

  @Column({
    name: 'collection_address',
  })
  collectionAddress: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
