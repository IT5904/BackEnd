import { NoticeSubTypeEnum, NoticeTypeEnum } from '@models/enums/notice.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index('marketplace_notice_owner_idx', ['owner'], {})
@Index('marketplace_notice_timestamp_idx', ['timestamp'], {})
@Entity('marketplace_notice')
export class MarketPlaceNoticeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'type',
    type: 'enum',
    enum: NoticeTypeEnum,
    default: NoticeTypeEnum.USER_ACTION,
  })
  type: NoticeTypeEnum;

  @Column({
    name: 'sub_type',
    type: 'enum',
    enum: NoticeSubTypeEnum,
    default: NoticeSubTypeEnum.CANCEL,
  })
  subType: NoticeSubTypeEnum;

  @Column()
  owner: string;

  @Column()
  operator: string;

  @Column()
  content: string;

  @Column({ name: 'is_read', default: 0 })
  isRead: number;

  @Column()
  image: string;

  @Column()
  name: string;

  @Column({ name: 'deleted', default: 0 })
  deleted: number;

  @Column({ name: 'owner_action' })
  ownerAction: number;

  @Column({
    name: 'price',
    type: 'decimal',
  })
  price: string;

  @Column({ name: 'nft_address' })
  nftAddress: string;

  @Column({ name: 'collection_address' })
  collectionAddress: string;

  @Column()
  timestamp: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
