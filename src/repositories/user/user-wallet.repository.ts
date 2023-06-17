import { UserInfoEntity, UserWalletEntity } from '@entities/postgres-entities';
import { Repository, EntityRepository, getRepository } from 'typeorm';
import { UserInfoResponse } from '@models/user/user-info.response';
import { plainToClass } from 'class-transformer';
import { NetworkTypeEnum } from '@models/enums/netwok.enum';
import { NewUserWalletModel } from '@models/user/new-user-wallet';

@EntityRepository(UserWalletEntity)
export class UserWalletRepository extends Repository<UserWalletEntity> {
  async createUser(
    id: number,
    model: NewUserWalletModel,
  ): Promise<UserWalletEntity> {
    const userModel = this.create(model);
    userModel.userInfoId = id;
    return await this.save(userModel);
  }

  async getUserInfo(
    address: string,
    network: NetworkTypeEnum,
  ): Promise<UserInfoResponse> {
    const userInfo = await getRepository(UserInfoEntity)
      .createQueryBuilder('ui')
      .select(
        `
      ui.id,
      ui.name,
      ui.email,
      ui.discord_url,
      ui.twitter_url,
      ui.avatar_url,
      ui.cover_url
    `,
      )
      .where(
        'ui.id = (SELECT uw.user_id FROM "user-wallet" uw WHERE uw.address = :address AND uw.network_type = :network)',
        { address: address, network: network },
      )
      .getRawOne();

    return userInfo;
  }

  async getUserInfoById(id: number): Promise<UserInfoResponse> {
    const queryBuilder = this.createQueryBuilder('uw')
      .select(
        `
        uw.user_id,
        uw.address,
        uw.network_type,
        ui.name,
        ui.email,
        ui.discord_url,
        ui.twitter_url,
        ui.avatar_url,
        ui.cover_url
    `,
      )
      .innerJoin(UserInfoEntity, 'ui', 'ui.id = uw.user_id')
      .where('ui.id = :id', {
        id: id,
      });

    const dataRaw = await queryBuilder.getRawOne();
    const data = plainToClass(UserInfoResponse, dataRaw);
    return data;
  }

  async getUserInfoByAddress(address: string): Promise<UserInfoResponse> {
    const queryBuilder = this.createQueryBuilder('uw')
      .select(
        `
        uw.user_id,
        uw.address,
        uw.network_type,
        ui.name,
        ui.email,
        ui.discord_url,
        ui.twitter_url,
        ui.avatar_url,
        ui.cover_url,
        ui.twitter_verify,
        ui.discord_verify
    `,
      )
      .innerJoin(UserInfoEntity, 'ui', 'ui.id = uw.user_id')
      .where('uw.address = :address', {
        address: address,
      });

    const dataRaw = await queryBuilder.getRawOne();
    const data = plainToClass(UserInfoResponse, dataRaw);
    return data;
  }
}
