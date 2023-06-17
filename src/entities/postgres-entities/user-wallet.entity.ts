import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NetworkTypeEnum } from '@models/enums/netwok.enum';

@Index('user_wallet_address_idx', ['address'], { unique: true })
@Index('user_wallet_user_id_idx', ['userInfoId'], {})
@Entity('user-wallet')
export class UserWalletEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userInfoId: number;

  @Column({
    name: 'network_type',
    type: 'enum',
    enum: NetworkTypeEnum,
    default: NetworkTypeEnum.ALEO,
  })
  networkType: NetworkTypeEnum;

  @Column()
  address: string;

  @Column({
    name: 'ip_address',
  })
  ipAddress: string;

  @Column({
    name: 'signature',
  })
  signature: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
