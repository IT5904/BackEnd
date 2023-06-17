import { NFTOrderEnum } from '@models/enums/collection.enum';
import { Transform } from 'class-transformer';
import { IsOptional, IsEnum, IsNumber, IsNotEmpty } from 'class-validator';
import { PaginationQuery } from '@models/pagination-query';
export class NftSearchModel extends PaginationQuery {
  @IsOptional()
  title: string;

  @IsOptional()
  nftId: string;

  @IsNotEmpty()
  collectionAddress: string;

  @IsOptional()
  filterProperties: string;

  @IsOptional()
  filterPropertiesKey: string;

  @IsOptional()
  minPrice: string;

  @IsOptional()
  maxPrice: string;

  @IsOptional()
  @Transform(({ value }) => +value)
  minRank: number;

  @IsOptional()
  @Transform(({ value }) => +value)
  maxRank: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (!value || value === 'false' || value === '0') return 0;
    if (value === '1') return 1;
  })
  isLisiting: boolean;

  @IsNotEmpty()
  @IsEnum(NFTOrderEnum)
  @Transform(({ value }) => +value)
  orderBy: NFTOrderEnum;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => +value)
  page: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => +value)
  limit: number;

  @IsOptional()
  cursor: string;

  @IsOptional()
  status: string;
}

export class NftFavoriteSearchModel extends PaginationQuery {
  @IsOptional()
  title: string;

  @IsOptional()
  nftId: string;

  @IsOptional()
  collectionAddress: string;

  @IsOptional()
  filterProperties: string;

  @IsOptional()
  filterPropertiesKey: string;

  @IsOptional()
  minPrice: string;

  @IsOptional()
  maxPrice: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (!value || value === 'false' || value === '0') return 0;
    if (value === '1') return 1;
  })
  isLisiting: boolean;

  @IsOptional()
  @IsEnum(NFTOrderEnum)
  @Transform(({ value }) => +value)
  orderBy: NFTOrderEnum;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => +value)
  page: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => +value)
  limit: number;

  @IsOptional()
  cursor: string;

  @IsOptional()
  status: string;
}

export class NftGetMoreModel extends PaginationQuery {
  @IsNotEmpty()
  collectionAddress: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => +value)
  page: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => +value)
  limit: number;
}

export class NftGetOfferModel extends PaginationQuery {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => +value)
  page: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => +value)
  limit: number;
}

export class NftGetUserNFTModel extends PaginationQuery {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => +value)
  page: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => +value)
  limit: number;

  @IsOptional()
  status: string;

  @IsOptional()
  collectionAddress: string;
}

export class NftExploreModel extends PaginationQuery {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => +value)
  page: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => +value)
  limit: number;

  @IsOptional()
  status: string;

  @IsOptional()
  minPrice: string;

  @IsOptional()
  maxPrice: string;

  @IsOptional()
  @IsEnum(NFTOrderEnum)
  @Transform(({ value }) => +value)
  orderBy: NFTOrderEnum;

  @IsOptional()
  title: string;
}

export class NftCartModel extends PaginationQuery {
  @IsNotEmpty()
  nftArray: any;
}
