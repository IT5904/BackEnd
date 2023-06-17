import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tocen_wait_verify_twitter')
export class TocenWaitVerifyTwitterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timestamp: number;

  @Column({ name: 'twitter_name' })
  twitterName: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
