// import { UserTypeEnum } from '@models/enums/user.status';
import { NetworkTypeEnum } from '../enums/netwok.enum';

export class UserInfo {
  id: number;

  name: string;

  email: string;

  walletAddress: string;

  network: NetworkTypeEnum;

  // userType: UserTypeEnum;
}
