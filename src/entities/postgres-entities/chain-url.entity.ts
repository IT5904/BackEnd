import { ChainUrlStatusEnum } from './../../models/enums/collection.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('chain-url')
export class ChainUrlEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'chain_url' })
  chainUrl: string;

  @Column({ name: 'client_status', default: 0 })
  clientStatus: number;

  @Column({ name: 'total_txn', default: 0 })
  totalTxn: number;

  @Column({ name: 'response_time' })
  responseTime: number;

  @Column({ name: 'env' })
  env: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ChainUrlStatusEnum,
    default: ChainUrlStatusEnum.GOOD,
  })
  status: ChainUrlStatusEnum;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
