import { IsOptional } from 'class-validator';
import { PaginationQuery } from '../pagination-query';

export class UserTestSearchRequest extends PaginationQuery {
  name: string;

  @IsOptional()
  email: string;
}
