import { IsNotEmpty, IsOptional } from 'class-validator';

export class NewNftSaleModel {
  @IsOptional()
  id: string;

  @IsNotEmpty()
  nftId: number;

  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  price: string;

  @IsNotEmpty()
  startPrice: string;

  @IsNotEmpty()
  endPrice: string;

  @IsOptional()
  quantity: number;

  @IsOptional()
  saleType?: number;

  @IsOptional()
  status?: number;

  @IsOptional()
  reserveBuyer: number;

  @IsNotEmpty()
  expireTime: number;

  @IsNotEmpty()
  blockTimestamp: number;
}
