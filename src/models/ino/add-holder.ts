// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IsNotEmpty } from 'class-validator';
import { PaginationQuery } from '@models/pagination-query';
export class AddHolder extends PaginationQuery {
  @IsNotEmpty()
  holder: string[];

  @IsNotEmpty()
  project: string;
}
