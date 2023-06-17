import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('crawler-status')
export class CrawlerStatusEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'contract_name' })
  contractName: string;

  @Column({
    name: 'contract_address',
  })
  contractAddress: string;

  @Column({
    name: 'tx_digest',
  })
  txDigest: string;

  @Column({
    name: 'module_name',
  })
  moduleName: string;

  @Column({
    name: 'type',
  })
  type: string;

  @Column({
    name: 'mint_function',
  })
  mintFunction: string;

  @Column({
    name: 'object_type',
  })
  objectType: string;

  @Column({
    name: 'is_enable',
  })
  isEnable: boolean;

  @Column({
    name: 'block_timestamp',
  })
  blockTimestamp: number;

  @Column({
    name: 'event_num_in_one_go',
    default: 100,
  })
  eventNumInOneGo: number;

  @Column({
    name: 'event_seq',
  })
  eventSeq: number;

  @Column({
    name: 'mint_event',
  })
  mintEvent: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
