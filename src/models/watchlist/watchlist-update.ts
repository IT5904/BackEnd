import { IsNotEmpty } from 'class-validator';

export class WatchlistUpdateModel {
  @IsNotEmpty()
  collectionAddress: string;
}
