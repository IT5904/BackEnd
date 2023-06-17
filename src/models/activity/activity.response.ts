import { CollectionActivitySearchTypeEnum } from '@models/enums/collection.enum';
import { Expose } from 'class-transformer';

export class ActivityResponse {
  @Expose({ name: 'image_url' })
  imageUrl: string;

  @Expose({ name: 'nft_address' })
  nftAddress: string;

  @Expose({ name: 'from_address' })
  fromAddress: string;

  @Expose({ name: 'user_address' })
  userAddress: boolean;

  @Expose({ name: 'activity' })
  activity: CollectionActivitySearchTypeEnum;

  @Expose({ name: 'transaction_id' })
  transactionId: string;

  @Expose({ name: 'timestamp' })
  timestamp: string;

  @Expose({ name: 'price' })
  price: string;

  @Expose()
  quantity: number;

  @Expose({ name: 'expire_time' })
  expireTime: number;
}
