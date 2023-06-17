import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index('user_info_twitter_url_idx', ['twitterUrl'], {})
@Index('user_info_update_timestamp_idx', ['updateTimestamp'], {})
@Entity('user-info')
export class UserInfoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column({
    name: 'discord_url',
  })
  discordUrl: string;

  @Column({
    name: 'twitter_url',
  })
  twitterUrl: string;

  @Column({
    name: 'twitter_verify',
  })
  twitterVerify: number;

  @Column({
    name: 'discord_verify',
  })
  discordVerify: number;

  @Column({
    name: 'avatar_url',
  })
  avatarUrl: string;

  @Column({
    name: 'website_url',
  })
  websiteUrl: string;

  @Column({
    name: 'cover_url',
  })
  coverUrl: string;

  @Column({
    name: 'ip_address',
  })
  ipAddress: string;

  @Column({
    name: 'update_timestamp',
  })
  updateTimestamp: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
