import { NetworkTypeEnum } from '@models/enums/netwok.enum';
import { CollectionTypeEnum } from '@models/enums/collection.enum';
import { Expose } from 'class-transformer';

export class CollectionResponse {
  @Expose()
  id: number;

  @Expose()
  address: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  logo: string;

  @Expose({ name: 'banner_image' })
  bannerImage: string;

  @Expose({ name: 'network_type' })
  networkType: NetworkTypeEnum;

  @Expose({ name: 'discord_url' })
  discordUrl: string;

  @Expose({ name: 'twitter_url' })
  twitterUrl: string;

  @Expose({ name: 'royalty_fee' })
  royaltyFee: number;

  @Expose({ name: 'collection_type' })
  collectionType: CollectionTypeEnum;

  @Expose({ name: 'creator_id' })
  creatorId: string;

  @Expose({ name: 'owners' })
  owners: number;

  @Expose({ name: 'total_items' })
  total_items: number;

  @Expose({ name: 'rarity' })
  rarity: boolean;

  @Expose({ name: 'floor_price_1h' })
  floorPrice1h: string;

  @Expose({ name: 'floor_price_1d' })
  floorPrice1d: string;

  @Expose({ name: 'floor_price_7d' })
  floorPrice7d: string;

  @Expose({ name: 'floor_price_1m' })
  floorPrice1m: string;

  @Expose({ name: 'volume_1h' })
  volume1h: string;

  @Expose({ name: 'volume_1d' })
  volume1d: string;

  @Expose({ name: 'volume_7d' })
  volume7d: string;

  @Expose({ name: 'volume_1m' })
  volume1m: string;

  @Expose({ name: 'percentage_volume_1h' })
  percentageVolume1h: string;

  @Expose({ name: 'percentage_volume_1d' })
  percentageVolume1d: string;

  @Expose({ name: 'percentage_volume_7d' })
  percentageVolume7d: string;

  @Expose({ name: 'percentage_volume_1m' })
  percentageVolume1m: string;

  @Expose({ name: 'percentage_floor_1h' })
  percentageFloor1h: string;

  @Expose({ name: 'percentage_floor_1d' })
  percentageFloor1d: string;

  @Expose({ name: 'percentage_floor_7d' })
  percentageFloor7d: string;

  @Expose({ name: 'percentage_floor_1m' })
  percentageFloor1m: string;

  @Expose({ name: 'total_volume' })
  totalVolume: string;

  @Expose({ name: 'floor_price' })
  floorPrice: string;

  @Expose({ name: 'floor_price_listing' })
  floorPriceListing: string;

  @Expose({ name: 'prev_volume' })
  prevVolume: string;

  @Expose({ name: 'listings' })
  listings: number;

  @Expose({ name: 'filter_properties' })
  filterProperties: any;

  @Expose({ name: 'is_like' })
  isLike: boolean;

  @Expose({ name: 'sales_1h' })
  sales1h: string;

  @Expose({ name: 'sales_1d' })
  sales1d: string;

  @Expose({ name: 'sales_7d' })
  sales7d: string;

  @Expose({ name: 'sales_1m' })
  sales1m: string;

  @Expose({ name: 'percentage_sales_1h' })
  percentageSales1h: string;

  @Expose({ name: 'percentage_sales_1d' })
  percentageSales1d: string;

  @Expose({ name: 'percentage_sales_7d' })
  percentageSales7d: string;

  @Expose({ name: 'percentage_sales_1m' })
  percentageSales1m: string;

  @Expose({ name: 'total_sales' })
  totalSales: string;

  @Expose({ name: 'verify_type' })
  verifyType: number;

  @Expose({ name: 'time_listing' })
  timeListing: Date;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}

export class CollectionChartResponse {
  @Expose({ name: 'total_volume' })
  totalVolume: string;

  @Expose({ name: 'floor_price' })
  floorPrice: string;

  @Expose({ name: 'total_sales' })
  totalSales: string;

  @Expose({ name: 'log_timestamp' })
  logTimestamp: string;
}
