import { PaginationQuery } from '@models/pagination-query';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UserNoticeResponse {
  @Expose({ name: 'id' })
  id: number;

  @Expose({ name: 'type' })
  type: number;

  @Expose({ name: 'sub_type' })
  subType: number;

  @Expose()
  owner: string;

  @Expose()
  operator: string;

  @Expose()
  content: string;

  @Expose({ name: 'is_read' })
  isRead: number;

  @Expose({ name: 'price' })
  price: number;

  @Expose({ name: 'owner_action' })
  ownerAction: number;

  @Expose()
  image: string;

  @Expose()
  name: string;

  @Expose({ name: 'nft_address' })
  nftAddress: string;

  @Expose({ name: 'collection_address' })
  collectionAddress: string;

  @Expose({ name: 'deleted' })
  deleted: number;

  @Expose()
  timestamp: number;

  @Expose({
    name: 'created_at',
  })
  createdAt: Date;
}

export class UserNoticeSearchModel extends PaginationQuery {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => +value)
  page: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => +value)
  limit: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => +value)
  type: number;
}
