import { IsNotEmpty } from 'class-validator';
import { PaginationQuery } from '@models/pagination-query';
export class UserInoModel extends PaginationQuery {
  @IsNotEmpty()
  address: string;
}
