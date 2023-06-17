import { UserStatusEnum } from '@models/enums/user.status';
export interface IUser {
  id: string;
  username?: string;
  email: string;
  address?: string;
  status: UserStatusEnum;
  description?: string;
}
