// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IsNotEmpty } from 'class-validator';
import { PaginationQuery } from '@models/pagination-query';
export class AddWhitelist extends PaginationQuery {
  @IsNotEmpty()
  whitelist: string[];

  @IsNotEmpty()
  project: string;
}
