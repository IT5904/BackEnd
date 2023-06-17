import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('collection_volume')
export class CollectionVolumeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'collection_id',
  })
  collectionId: number;

  @Column({
    name: 'collection_address',
  })
  collectionAddress: string;

  @Column({
    name: 'floor_price_1h',
    type: 'decimal',
  })
  floorPrice1h: string;

  @Column({
    name: 'floor_price_1d',
    type: 'decimal',
  })
  floorPrice1d: string;

  @Column({
    name: 'floor_price_7d',
    type: 'decimal',
  })
  floorPrice7d: string;

  @Column({
    name: 'floor_price_1m',
    type: 'decimal',
  })
  floorPrice1m: string;

  @Column({
    name: 'volume_1h',
    type: 'decimal',
  })
  volume1h: string;

  @Column({
    name: 'volume_1d',
    type: 'decimal',
  })
  volume1d: string;

  @Column({
    name: 'volume_7d',
    type: 'decimal',
  })
  volume7d: string;

  @Column({
    name: 'volume_1m',
    type: 'decimal',
  })
  volume1m: string;

  @Column({
    name: 'total_volume',
    type: 'decimal',
  })
  totalVolume: string;

  @Column({
    name: 'floor_price',
    type: 'decimal',
  })
  floorPrice: string;

  @Column({
    name: 'percentage_volume_1h',
    type: 'decimal',
  })
  percentageVolume1h: string;

  @Column({
    name: 'percentage_volume_1d',
    type: 'decimal',
  })
  percentageVolume1d: string;

  @Column({
    name: 'percentage_volume_7d',
    type: 'decimal',
  })
  percentageVolume7d: string;

  @Column({
    name: 'percentage_volume_1m',
    type: 'decimal',
  })
  percentageVolume1m: string;

  @Column({
    name: 'percentage_floor_1h',
    type: 'decimal',
  })
  percentageFloor1h: string;

  @Column({
    name: 'percentage_floor_1d',
    type: 'decimal',
  })
  percentageFloor1d: string;

  @Column({
    name: 'percentage_floor_7d',
    type: 'decimal',
  })
  percentageFloor7d: string;

  @Column({
    name: 'percentage_floor_1m',
    type: 'decimal',
  })
  percentageFloor1m: string;

  @Column({
    name: 'prev_volume',
    type: 'decimal',
  })
  prevVolume: string;

  @Column({
    name: 'sales_1h',
    type: 'decimal',
  })
  sales1h: string;

  @Column({
    name: 'sales_1d',
    type: 'decimal',
  })
  sales1d: string;

  @Column({
    name: 'sales_7d',
    type: 'decimal',
  })
  sales7d: string;

  @Column({
    name: 'sales_1m',
    type: 'decimal',
  })
  sales1m: string;

  @Column({
    name: 'total_sales',
    type: 'decimal',
  })
  totalSales: string;

  @Column({
    name: 'percentage_sales_1h',
    type: 'decimal',
  })
  percentageSales1h: string;

  @Column({
    name: 'percentage_sales_1d',
    type: 'decimal',
  })
  percentageSales1d: string;

  @Column({
    name: 'percentage_sales_7d',
    type: 'decimal',
  })
  percentageSales7d: string;

  @Column({
    name: 'percentage_sales_1m',
    type: 'decimal',
  })
  percentageSales1m: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
