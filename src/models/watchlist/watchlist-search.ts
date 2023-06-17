import { IsNotEmpty, IsOptional } from 'class-validator';

export class WatchlistSearchModel {
  @IsNotEmpty()
  page: number;

  @IsNotEmpty()
  limit: number;

  @IsOptional()
  typeFilter: string;

  @IsOptional()
  time: string;
}
