import { IsOptional } from 'class-validator';
import { PaginationQuery } from '@models/pagination-query';

export class StatiticModel extends PaginationQuery {
  @IsOptional()
  collectionAddress: string;
}
