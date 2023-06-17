import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('collection_properties')
export class CollectionPropertiesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'collection_address' })
  collectionAddress: string;

  @Column({ name: 'properties' })
  properties: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
