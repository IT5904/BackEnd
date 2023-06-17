import { IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
export class NftDataModel {
  @IsOptional()
  id: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  nftId: string;

  @IsNotEmpty()
  @IsNumber()
  collectionId: number;

  @IsNotEmpty()
  address: string;

  @IsOptional()
  description: string;

  @IsOptional()
  maxQuantity: number;

  @IsOptional()
  imageUrl: string;

  @IsOptional()
  properties: Array<{ key: string; value: string }>;

  @IsOptional()
  externalLink: string;
}
