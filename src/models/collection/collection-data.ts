import { IsOptional, IsNotEmpty } from 'class-validator';
import { NetworkTypeEnum } from '@models/enums/netwok.enum';
import { CollectionTypeEnum } from '@models/enums/collection.enum';
export class CollectionDataModel {
  @IsOptional()
  name: string;

  @IsNotEmpty()
  address: string;

  @IsOptional()
  description: string;

  @IsOptional()
  bannerImage: string;

  @IsOptional()
  logo: string;

  @IsOptional()
  status: number;

  @IsOptional()
  networkType: NetworkTypeEnum;

  @IsOptional()
  collectionType: CollectionTypeEnum;

  @IsOptional()
  discordUrl: string;

  @IsOptional()
  twitterUrl: string;

  @IsOptional()
  royaltyFee: number;

  @IsOptional()
  timeListing: number;

  @IsOptional()
  mintTime: number;

  @IsOptional()
  onchainType: string;
}
