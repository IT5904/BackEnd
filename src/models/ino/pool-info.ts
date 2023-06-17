// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IsNotEmpty } from 'class-validator';
import { PaginationQuery } from '@models/pagination-query';
export class PoolInoModel extends PaginationQuery {
  @IsNotEmpty()
  project: string;
}
