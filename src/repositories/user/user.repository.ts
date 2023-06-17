import UserModel from '@entities/mongo-entities/user/user.entity';
import { IUser } from '@entities/mongo-entities/user/user.interface';
import { UserCreateRequest } from '@models/user/user-create.request';
import { UserStatusEnum } from '@models/enums/user.status';

export class UserRepository {
  /**
   * Get list user
   */
  async getListUser(): Promise<IUser[]> {
    return await UserModel.find();
  }

  async getUser(email: string): Promise<IUser> {
    return await UserModel.findOne({
      email: email,
    });
  }

  async getActiveUser(address: string): Promise<IUser> {
    return await UserModel.findOne({
      address: address,
      status: UserStatusEnum.NORMAL,
    });
  }

  /**
   * Create user
   */
  async createUser(userCreateRequest: UserCreateRequest): Promise<IUser> {
    return await UserModel.create({
      username: userCreateRequest.username,
      email: userCreateRequest.email,
      address: userCreateRequest.address,
      description: userCreateRequest.description,
    });
  }
}
