import {
  IsEnum,
  IsNotEmpty,
  ValidateIf,
  IsOptional,
  IsArray,
} from 'class-validator';
import { PaginationQuery } from '../pagination-query';
import {
  CollectionActivitySearchTypeEnum,
  CollectionActivityTypeEnum,
} from '../enums/collection.enum';

export class ActivitySearchRequest extends PaginationQuery {
  @ValidateIf(
    (searchType) =>
      searchType.searchBy !== CollectionActivitySearchTypeEnum.USER,
  )
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  @IsEnum(CollectionActivitySearchTypeEnum)
  searchBy: CollectionActivitySearchTypeEnum;

  @IsOptional()
  @IsArray()
  @IsEnum(CollectionActivityTypeEnum, { each: true })
  activityType?: number[];

  @ValidateIf(
    (searchType) =>
      searchType.searchBy === CollectionActivitySearchTypeEnum.USER,
  )
  @IsNotEmpty()
  userAddress?: string;

  @IsNotEmpty()
  limit: number;

  @IsNotEmpty()
  page: number;
}
