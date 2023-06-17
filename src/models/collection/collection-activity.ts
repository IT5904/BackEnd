import { CollectionActivityTypeEnum } from './../enums/collection.enum';
import { IsOptional, IsNotEmpty } from 'class-validator';

export class NewCollectionActivityModel {
  @IsOptional()
  id: number;

  @IsOptional()
  collectionId: number;

  @IsOptional()
  nftId: number;

  @IsOptional()
  userId: number;

  @IsNotEmpty()
  activity: CollectionActivityTypeEnum;

  @IsOptional()
  transactionId: string;

  @IsOptional()
  timestamp: number;
}
