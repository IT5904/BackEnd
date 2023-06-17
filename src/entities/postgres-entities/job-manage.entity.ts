import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CrawlJobStatus } from '@models/enums/crawler-status.enum';

@Entity('job-manage')
export class JobManageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'contract_name' })
  contractName: string;

  @Column({
    name: 'contract_address',
  })
  contractAddress: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: CrawlJobStatus,
  })
  status: CrawlJobStatus;

  @Column({
    name: 'type',
  })
  type: string;

  @Column({
    name: 'job_name',
  })
  jobName: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
