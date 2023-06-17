import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index('tocen_user_twitter_sortindex_idx', ['sortindex'], {})
@Index('tocen_user_twitter_username_idx', ['username'], {})
@Entity('tocen_user_twitter')
export class TocenUserTwitterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sortindex: number;

  @Column()
  timestamp: number;

  @Column()
  username: string;

  @Column({ name: 'twitter_id' })
  twitterId: string;

  @Column({ name: 'access_token' })
  accessToken: string;

  @Column({ name: 'name' })
  name: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
