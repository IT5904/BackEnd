// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IsNotEmpty } from 'class-validator';
import { PaginationQuery } from '@models/pagination-query';
export class AddPrivate extends PaginationQuery {
  @IsNotEmpty()
  private: string[];

  @IsNotEmpty()
  project: string;
}
