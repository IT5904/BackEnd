// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IsNotEmpty, IsOptional } from 'class-validator';
import { PaginationQuery } from '@models/pagination-query';
export class MintNftInoModel extends PaginationQuery {
  @IsNotEmpty()
  project: string;

  @IsNotEmpty()
  type: string;

  @IsOptional()
  inviteRefCode: string;

  @IsOptional()
  txnID: string;
}
