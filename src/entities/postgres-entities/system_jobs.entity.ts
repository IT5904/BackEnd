import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('system_jobs')
export class SystemJobs {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

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

  @Column('bigint', { name: 'current_logid', nullable: true })
  currentLogid: string | null;

  @Column('integer', { name: 'jobid', nullable: true })
  jobid: number | null;

  @Column('bigint', { name: 'current_timestamp', nullable: true })
  currentTimestamp: string | null;

  @Column('text', { name: 'jobdescription', nullable: true })
  jobdescription: string | null;

  @Column('text', { name: 'job_name', nullable: true })
  jobName: string | null;

  @Column('text', { name: 'next_cursor', nullable: true })
  nextCursor: string | null;
}
