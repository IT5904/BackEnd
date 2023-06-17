import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tool_wallet_balance')
export class WalletBalanceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'wallet_address', type: 'text' })
  walletAddress: string;

  @Column({ name: 'coin', type: 'text' })
  coin: string;

  @Column({ name: 'balance' })
  balance: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
