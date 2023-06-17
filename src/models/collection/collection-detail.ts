import { IsNotEmpty } from 'class-validator';

export class CollectionDetailModel {
  @IsNotEmpty()
  address: string;
}
