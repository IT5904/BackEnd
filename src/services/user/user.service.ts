import 'reflect-metadata';
import { IUser } from '@entities/mongo-entities/user/user.interface';
import { UserRepository } from '@repositories/user/user.repository';
import { UserWatchlistRepository } from '@repositories/user/watchlist.repository';
import { UserCreateRequest } from '@models/user/user-create.request';
import { ApiError } from '@models/api-error';
import { getConnection } from 'typeorm';
import { Service } from 'typedi';
import { ResponseCodeEnum } from '@models/enums/response-code.enum';
import { UserStatusEnum } from '@models/enums/user.status';
import { StatusCodes } from 'http-status-codes';
import { UserWalletRepository } from '@repositories/user/user-wallet.repository';
import { UserInfoRepository } from '@repositories/user/user-info.repository';
import { UserPostgresCreateRequest } from '@models/user/user-postgres-create.request';
import { logger } from '@core/logger';
import { OperationTypeEnum } from '@models/enums/operation-type.enum';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { plainToClass } from 'class-transformer';
import { NewUserInfoModel } from '@models/user/new-user-info';
import { NewUserWalletModel } from '@models/user/new-user-wallet';
import { UserInfoResponse } from '@models/user/user-info.response';
import { UpdateUserInfoModel } from '@models/user/update-user';
import { UserInfoEntity } from '@entities/postgres-entities';
import { UserInfo } from '@models/authorzization/user.info';
import { WatchlistUpdateModel } from '@models/watchlist/watchlist-update';
import { WatchlistSearchModel } from '@models/watchlist/watchlist-search';
import { UserNoticeResponse } from '@models/user/user-notice.response';

@Service()
export class UserService {
  private readonly userRepository: UserRepository;

  constructor(
    @InjectRepository()
    private readonly userWatchlistRepository: UserWatchlistRepository,
    @InjectRepository()
    private readonly userWalletRepository: UserWalletRepository,
    @InjectRepository()
    private readonly userInfoRepository: UserInfoRepository,
  ) {
    this.userRepository = new UserRepository();
  }

  /**
   * Get list user
   */
  async getListUser(): Promise<IUser[]> {
    return await this.userRepository.getListUser();
  }

  /**
   * Get Active User
   */
  async getActiveUser(address: string): Promise<IUser> {
    return await this.userRepository.getActiveUser(address);
  }

  /**
   * Get User Info
   */
  async getUserInfo(id: number): Promise<UserInfoResponse> {
    const user = await this.userWalletRepository.getUserInfoById(id);
    if (!user)
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0008);
    return user;
  }

  /**
   * Get User Profile
   */
  async getUserProfile(address: string): Promise<UserInfoResponse> {
    const user = await this.userWalletRepository.getUserInfoByAddress(address);
    if (!user)
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0008);
    return user;
  }

  /**
   * Update User Profile
   */
  async updateUserProfile(
    address: string,
    dataBody: UpdateUserInfoModel,
  ): Promise<UserInfoEntity> {
    const user = await this.userInfoRepository.updateUserProfile(
      address,
      dataBody,
    );
    return user;
  }

  /**
   * Add an user to waiting list
   */
  async addToWaitingList(model: UserCreateRequest): Promise<IUser> {
    const waitingUser = await this.userRepository.getUser(model.email);

    if (waitingUser)
      throw new ApiError(StatusCodes.CONFLICT, ResponseCodeEnum.CM0006);

    if (waitingUser?.status === UserStatusEnum.NORMAL)
      throw new ApiError(StatusCodes.CONFLICT, ResponseCodeEnum.CM0007);

    return await this.userRepository.createUser(model);
  }

  /**
   * Get user watchlist
   */
  async getUserWatchlist(
    dataQuery: WatchlistSearchModel,
    user: UserInfo,
  ): Promise<any> {
    return await this.userWatchlistRepository.getUserWatchlist(dataQuery, user);
  }

  /**
   * add and remove user watchlist
   */
  async addAndRemoveUserWatchlist(
    dataBody: WatchlistUpdateModel,
    user: UserInfo,
  ): Promise<boolean> {
    return await this.userWatchlistRepository.addAndRemoveUserWatchlist(
      dataBody,
      user,
    );
  }

  async createUser(
    model: UserPostgresCreateRequest,
    operationType: OperationTypeEnum,
  ) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const userInfoModel = plainToClass(NewUserInfoModel, model);
      const userInfo = await queryRunner.manager
        .getCustomRepository(UserInfoRepository)
        .createUser(userInfoModel, operationType);

      if (operationType === OperationTypeEnum.REGISTER) {
        const userWalletModel = plainToClass(NewUserWalletModel, model);
        await queryRunner.manager
          .getCustomRepository(UserWalletRepository)
          .createUser(userInfo.id, userWalletModel);
      }

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();

      logger.error('ERROR: ', e);
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async registNewChain(id: number, model: NewUserWalletModel) {
    try {
      await this.userWalletRepository.createUser(id, model);
    } catch (e) {
      logger.error('ERROR: ', e);
      throw e;
    }
  }

  /**
   * Get User Notice
   */
  async getUserNotice(
    dataQuery,
    user: UserInfo,
  ): Promise<{ rows: UserNoticeResponse[]; nextPage: boolean }> {
    const res = await this.userInfoRepository.getUserNotice(dataQuery, user);
    return res;
  }

  /**
   * Get New Notice
   */
  async getNewNotice(user: UserInfo): Promise<number> {
    const res = await this.userInfoRepository.getNewNotice(user);
    return res;
  }

  /**
   * Delete User Notice
   */
  async deleteUserNotice(noticeId, user: UserInfo): Promise<boolean> {
    const res = await this.userInfoRepository.deleteUserNotice(noticeId, user);
    return res;
  }

  /**
   * Read User Notice
   */
  async readUserNotice(noticeId, user: UserInfo): Promise<boolean> {
    const res = await this.userInfoRepository.readUserNotice(noticeId, user);
    return res;
  }

  /**
   * Delete All User Notice
   */
  async clearAllNotice(user: UserInfo): Promise<boolean> {
    const res = await this.userInfoRepository.clearAllNotice(user);
    return res;
  }

  /**
   * Read All User Notice
   */
  async readAllNotice(user: UserInfo): Promise<boolean> {
    const res = await this.userInfoRepository.readAllNotice(user);
    return res;
  }

  /**
   * Delete All User Notice
   */
  async migrateNotice(user: UserInfo): Promise<boolean> {
    const res = await this.userInfoRepository.migrateNotice(user);
    return res;
  }
}
