import { IsNotEmpty } from 'class-validator';
import { NetworkTypeEnum } from '../enums/netwok.enum';

export class LoginRequest {
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  signature: string;

  @IsNotEmpty()
  network: NetworkTypeEnum;

  @IsNotEmpty()
  messageBytes: string;
}
