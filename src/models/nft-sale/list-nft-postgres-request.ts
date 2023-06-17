import { CollectionActivityTypeEnum } from './../enums/collection.enum';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class ListNftPostgresRequest {
  @IsOptional()
  id: string;

  @IsNotEmpty()
  nftId: number;

  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  price: string;

  @IsNotEmpty()
  startPrice: string;

  @IsNotEmpty()
  endPrice: string;

  @IsOptional()
  quantity: number;

  @IsOptional()
  saleType?: number;

  @IsOptional()
  status?: number;

  @IsOptional()
  reserveBuyer: number;

  @IsNotEmpty()
  expireTime: number;

  @IsNotEmpty()
  blockTimestamp: number;

  //   collectionActivity
  @IsOptional()
  collectionId: number;

  @IsNotEmpty()
  activity: CollectionActivityTypeEnum;

  @IsOptional()
  transactionId: string;

  @IsOptional()
  timestamp: number;
}
