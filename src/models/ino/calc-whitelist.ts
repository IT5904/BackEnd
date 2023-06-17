// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IsNotEmpty } from 'class-validator';
import { PaginationQuery } from '@models/pagination-query';
export class CalcWhitelist extends PaginationQuery {
  @IsNotEmpty()
  project: string;
}
