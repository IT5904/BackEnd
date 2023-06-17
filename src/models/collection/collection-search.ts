import { IsOptional, IsNotEmpty } from 'class-validator';

export class CollectionSearchModel {
  @IsOptional()
  name: string;

  @IsOptional()
  newest: number;

  @IsOptional()
  typeFilter: string;

  @IsOptional()
  time: string;

  @IsNotEmpty()
  limit: number;

  @IsNotEmpty()
  page: number;
}
