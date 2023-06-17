import { IsNotEmpty, IsEnum } from 'class-validator';
import { NetworkTypeEnum } from '../enums/netwok.enum';

export class NewUserWalletModel {
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  @IsEnum(NetworkTypeEnum)
  networkType: NetworkTypeEnum;
}
