import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tocen_user_twitter_top_list', { schema: 'public' })
export class TocenUserTwitterTopList {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'sortindex', nullable: true })
  sortindex: string | null;

  @Column('text', { name: 'username', nullable: true })
  username: string | null;

  @Column('timestamp without time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp without time zone', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('bigint', { name: 'timestamp', nullable: true })
  timestamp: string | null;

  @Column('text', { name: 'next_cursor', nullable: true })
  nextCursor: string | null;
}
