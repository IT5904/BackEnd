import {
  CollectionActivityEntity,
  MarketPlaceNoticeEntity,
  NftEntity,
  OfferSaleEntity,
  UserInfoEntity,
  UserWalletEntity,
} from '@entities/postgres-entities';
import { Repository, EntityRepository, getRepository } from 'typeorm';
import { getConnection } from 'typeorm';
import { OperationTypeEnum } from '@models/enums/operation-type.enum';
import { logger } from '@core/logger';
import { NewUserInfoModel } from '@models/user/new-user-info';
import { UpdateUserInfoModel } from '@models/user/update-user';
import { ApiError } from '@models/api-error';
import { ResponseCodeEnum } from '@models/enums/response-code.enum';
import { StatusCodes } from 'http-status-codes';
import { UserInfo } from '@models/authorzization/user.info';
import { UserNoticeResponse } from '@models/user/user-notice.response';
import { plainToClass } from 'class-transformer';
import Paging from '@core/utils/paging';
import {
  NoticeContentEnum,
  NoticeSubTypeEnum,
  NoticeTypeEnum,
} from '@models/enums/notice.enum';

@EntityRepository(UserInfoEntity)
export class UserInfoRepository extends Repository<UserInfoEntity> {
  async createUser(
    model: NewUserInfoModel,
    operationType: OperationTypeEnum,
  ): Promise<UserInfoEntity> {
    logger.info('operationType repository: ', operationType);

    const userModel = this.create(model);
    if (operationType === OperationTypeEnum.REGISTER) {
      return await this.save(userModel);
    }

    if (operationType === OperationTypeEnum.EDIT) {
      await this.createQueryBuilder()
        .update(UserInfoEntity)
        .set({
          email: model.email,
          name: model.name,
          discordUrl: model.discordUrl,
          twitterUrl: model.twitterUrl,
          avatarUrl: model.avatarUrl,
          coverUrl: model.coverUrl,
        })
        .where('id = :id', { id: model.id })
        .execute();

      return await this.findOne({ where: { id: model.id } });
    }
  }

  async checkTwitterAndDiscord(addressData): Promise<boolean> {
    const { address, twitterUrl, discordUrl } = addressData;
    if (twitterUrl && twitterUrl != '') {
      const check_twitter = await getRepository(UserInfoEntity)
        .createQueryBuilder('ui')
        .select(
          `
        ui.id,
        ui.twitter_url,
        ui.discord_url,
        uw.address
      `,
        )
        .leftJoin(UserWalletEntity, 'uw', 'ui.id = uw.user_id')
        .where('ui.twitter_url = :twitterUrl AND uw.address != :address', {
          address: address,
          twitterUrl: twitterUrl,
        })
        .getRawOne();
      if (check_twitter) {
        return false;
      }
    }

    if (discordUrl && discordUrl != '') {
      const check_discord = await getRepository(UserInfoEntity)
        .createQueryBuilder('ui')
        .select(
          `
        ui.id,
        ui.twitter_url,
        ui.discord_url,
        uw.address
      `,
        )
        .leftJoin(UserWalletEntity, 'uw', 'ui.id = uw.user_id')
        .where('discord_url = :discordUrl AND uw.address != :address', {
          address: address,
          discordUrl: discordUrl,
        })
        .getRawOne();
      if (check_discord) {
        return false;
      }
    }
    return true;
  }

  async updateUserProfile(
    address: string,
    dataBody: UpdateUserInfoModel,
  ): Promise<UserInfoEntity> {
    const userInfo = await getRepository(UserInfoEntity)
      .createQueryBuilder('ui')
      .select(
        `
      ui.id,
      ui.name,
      ui.email,
      ui.discord_url,
      ui.twitter_url,
      ui.discord_verify,
      ui.twitter_verify,
      ui.avatar_url,
      ui.cover_url
    `,
      )
      .where(
        'ui.id = (SELECT uw.user_id FROM "user-wallet" uw WHERE uw.address = :address AND uw.network_type = :network)',
        { address: address, network: 1 },
      )
      .getRawOne();

    // const checkSocial = await this.checkTwitterAndDiscord({
    //   address,
    //   twitterUrl: dataBody.twitterUrl ? dataBody.twitterUrl : '',
    //   discordUrl: dataBody.discordUrl ? dataBody.discordUrl : '',
    // });

    // if (checkSocial === false) {
    //   throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0015);
    // }
    dataBody.twitterUrl =
      dataBody.twitterUrl && dataBody.twitterUrl !== ''
        ? dataBody.twitterUrl
            .replace('@', '')
            .replace('https://twitter.com/', '')
            .replace('https://mobile.twitter.com/', '')
        : '';
    dataBody.discordUrl =
      dataBody.discordUrl && dataBody.discordUrl !== ''
        ? dataBody.discordUrl
        : '';

    await getConnection().manager.query(
      `SELECT public.tocen_user_twitter_verify_insert($1, $2, $3, $4)`,
      [address, Number(userInfo.id), Date.now(), dataBody.twitterUrl],
    );

    await this.createQueryBuilder()
      .update(UserInfoEntity)
      .set({
        ...dataBody,
        updateTimestamp: Date.now(),
        discordVerify:
          userInfo.discord_url != dataBody.discordUrl
            ? 0
            : userInfo.discord_verify,
        twitterVerify:
          userInfo.twitter_url != dataBody.twitterUrl
            ? 0
            : userInfo.twitter_verify,
      })
      .where('id = :id', { id: userInfo.id })
      .execute();

    return await this.findOne({ where: { id: userInfo.id } });
  }

  async getUserNotice(
    dataQuery,
    user: UserInfo,
  ): Promise<{ rows: UserNoticeResponse[]; nextPage: boolean }> {
    if (!user) {
      return {
        rows: [],
        nextPage: false,
      };
    }
    const paging = Paging(dataQuery.page, dataQuery.limit);
    const query = getRepository(MarketPlaceNoticeEntity)
      .createQueryBuilder('mn')
      .select(
        `
        mn.id,
        mn.type,
        mn.sub_type,
        mn.owner,
        mn.operator,
        mn.content,
        mn.is_read,
        mn.image,
        mn.name,
        mn.deleted,
        mn.price,
        mn.nft_address,
        mn.collection_address,
        mn.timestamp,
        mn.owner_action,
        mn.created_at
    `,
      )
      .where('mn.owner = :owner AND deleted != 1', {
        owner: user.walletAddress,
      })
      .orderBy('mn.timestamp', 'DESC')
      .offset(paging.skip)
      .limit(paging.take);

    if (dataQuery.type != null) {
      query.andWhere('mn.type = :type', { type: dataQuery.type });
    }
    const data = await query.getRawMany();
    return {
      rows: plainToClass(UserNoticeResponse, data, {
        excludeExtraneousValues: true,
      }),
      nextPage: data.length < paging.take ? false : true,
    };
  }

  async getNewNotice(user: UserInfo): Promise<number> {
    if (!user) {
      return 0;
    }
    const newNotice = await getRepository(MarketPlaceNoticeEntity)
      .createQueryBuilder('mn')
      .select(
        `
        mn.id
    `,
      )
      .where('mn.owner = :owner AND mn.is_read = 0 AND mn.deleted != 1', {
        owner: user.walletAddress,
      })
      .getCount();

    return newNotice;
  }

  async deleteUserNotice(noticeId, user: UserInfo): Promise<boolean> {
    if (!noticeId || noticeId == '' || noticeId == null) {
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0005);
    }
    await getRepository(MarketPlaceNoticeEntity)
      .createQueryBuilder()
      .update()
      .set({ deleted: 1 })
      .where('owner = :owner AND id = :id', {
        owner: user.walletAddress,
        id: Number(noticeId),
      })
      .execute();
    return true;
  }

  async readUserNotice(noticeId, user: UserInfo): Promise<boolean> {
    if (!noticeId || noticeId == '' || noticeId == null) {
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0005);
    }
    await getRepository(MarketPlaceNoticeEntity)
      .createQueryBuilder()
      .update()
      .set({ isRead: 1 })
      .where('owner = :owner AND id = :id', {
        owner: user.walletAddress,
        id: Number(noticeId),
      })
      .execute();
    return true;
  }

  async clearAllNotice(user: UserInfo): Promise<boolean> {
    await getRepository(MarketPlaceNoticeEntity)
      .createQueryBuilder()
      .update()
      .set({ deleted: 1 })
      .where('owner = :owner', {
        owner: user.walletAddress,
      })
      .execute();
    return true;
  }

  async readAllNotice(user: UserInfo): Promise<boolean> {
    await getRepository(MarketPlaceNoticeEntity)
      .createQueryBuilder()
      .update()
      .set({ isRead: 1 })
      .where('owner = :owner', {
        owner: user.walletAddress,
      })
      .execute();
    return true;
  }

  async migrateNotice(user: UserInfo): Promise<boolean> {
    await this.migrateCollectionActivity(user);
    await this.migrateOfferReceive(user.walletAddress);
    return true;
  }

  async migrateCollectionActivity(user) {
    const data = await getRepository(CollectionActivityEntity)
      .createQueryBuilder('ca')
      .select(
        `
      ca.nft_address,
      ca.collection_address,
      ca.from_address,
      ca.user_address,
      ca.timestamp,
      ca.price,
      ca.activity,
      ca.transaction_id
    `,
      )
      .where('from_address = :fromAddress', { fromAddress: user.walletAddress })
      .getRawMany();
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      const nftData = await getRepository(NftEntity)
        .createQueryBuilder('n')
        .select(
          `
          n.title,
          n.nft_address,
          n.collection_address,
          n.image_url
        `,
        )
        .where('n.nft_address = :nftAddress', {
          nftAddress: element.nft_address,
        })
        .getRawOne();
      let dataCreate = {};
      switch (element.activity) {
        case NoticeSubTypeEnum.LISTING: {
          dataCreate = {
            type: NoticeTypeEnum.USER_ACTION,
            subType: element.activity,
            owner: user.walletAddress,
            nftAddress: element.nft_address,
            collectionAddress: element.collection_address,
            price: element.price,
            content: NoticeContentEnum.LISTING,
            isRead: 0,
            deleted: 0,
            image: nftData.image_url,
            name: nftData.title,
            operator: '',
          };
          break;
        }
        case NoticeSubTypeEnum.CANCEL: {
          dataCreate = {
            type: NoticeTypeEnum.USER_ACTION,
            subType: element.activity,
            owner: user.walletAddress,
            nftAddress: element.nft_address,
            collectionAddress: element.collection_address,
            price: element.price,
            content: NoticeContentEnum.CANCEL,
            isRead: 0,
            deleted: 0,
            image: nftData.image_url,
            name: nftData.title,
            operator: '',
          };
          break;
        }
        case NoticeSubTypeEnum.UPDATE: {
          dataCreate = {
            type: NoticeTypeEnum.USER_ACTION,
            subType: element.activity,
            owner: user.walletAddress,
            nftAddress: element.nft_address,
            collectionAddress: element.collection_address,
            price: element.price,
            content: NoticeContentEnum.UPDATE,
            isRead: 0,
            deleted: 0,
            image: nftData.image_url,
            name: nftData.title,
            operator: '',
          };
          break;
        }
        case NoticeSubTypeEnum.OFFER: {
          dataCreate = {
            type: NoticeTypeEnum.USER_ACTION,
            subType: element.activity,
            owner: user.walletAddress,
            nftAddress: element.nft_address,
            collectionAddress: element.collection_address,
            price: element.price,
            content: NoticeContentEnum.OFFER,
            isRead: 0,
            deleted: 0,
            image: nftData.image_url,
            name: nftData.title,
            operator: '',
          };
          break;
        }
        case NoticeSubTypeEnum.CANCEL_OFFER: {
          dataCreate = {
            type: NoticeTypeEnum.USER_ACTION,
            subType: element.activity,
            owner: user.walletAddress,
            nftAddress: element.nft_address,
            collectionAddress: element.collection_address,
            price: element.price,
            content: NoticeContentEnum.CANCEL_OFFER,
            isRead: 0,
            deleted: 0,
            image: nftData.image_url,
            name: nftData.title,
            operator: '',
          };
          break;
        }
        case NoticeSubTypeEnum.ACCEPT_OFFER: {
          dataCreate = {
            type: NoticeTypeEnum.USER_ACTION,
            subType: element.activity,
            owner: user.walletAddress,
            nftAddress: element.nft_address,
            collectionAddress: element.collection_address,
            price: element.price,
            content: NoticeContentEnum.ACCEPT_OFFER,
            isRead: 0,
            deleted: 0,
            image: nftData.image_url,
            name: nftData.title,
            operator: '',
          };
          break;
        }
        case NoticeSubTypeEnum.COMPLETE: {
          dataCreate = {
            type: NoticeTypeEnum.USER_ACTION,
            subType: element.activity,
            owner: user.walletAddress,
            nftAddress: element.nft_address,
            collectionAddress: element.collection_address,
            price: element.price,
            content: NoticeContentEnum.COMPLETE,
            isRead: 0,
            deleted: 0,
            image: nftData.image_url,
            name: nftData.title,
            operator: '',
          };
          break;
        }
        case NoticeSubTypeEnum.TRANSFER: {
          dataCreate = {
            type: NoticeTypeEnum.USER_ACTION,
            subType: element.activity,
            owner: user.walletAddress,
            nftAddress: element.nft_address,
            collectionAddress: element.collection_address,
            price: element.price,
            content: NoticeContentEnum.TRANSFER,
            isRead: 0,
            deleted: 0,
            image: '',
            name: '',
            operator: '',
          };
          break;
        }
        case NoticeSubTypeEnum.MINT: {
          dataCreate = {
            type: NoticeTypeEnum.USER_ACTION,
            subType: element.activity,
            owner: user.walletAddress,
            nftAddress: element.nft_address,
            collectionAddress: element.collection_address,
            price: element.price,
            content: NoticeContentEnum.MINT,
            isRead: 0,
            deleted: 0,
            image: nftData.image_url,
            name: nftData.title,
            operator: '',
          };
          break;
        }
      }
      await getRepository(MarketPlaceNoticeEntity)
        .createQueryBuilder()
        .insert()
        .values(dataCreate)
        .execute();
    }
  }

  async migrateOfferReceive(userAddress) {
    const query = getRepository(NftEntity)
      .createQueryBuilder('n')
      .select(
        `
        n.title,
        n.nft_address,
        n.collection_address,
        n.image_url,
        n.listing_price,
        n.offer_price,
        n.market_price
      `,
      )
      .where('n.owner_address = :userAddress', { userAddress: userAddress })
      .orderBy({ 'n.created_at': 'DESC' });

    const rawData = await query.getRawMany();

    for (let index = 0; index < rawData.length; index++) {
      const listOffer = await getRepository(OfferSaleEntity)
        .createQueryBuilder('os')
        .select(
          `
        os.price,
        os.status,
        os.expire_time,
        os.start_time,
        os.block_timestamp,
        os.user_address,
        os.nft_address
      `,
        )
        .where('os.user_address != :userAddress', { userAddress: userAddress })
        .where('os.nft_address = :nftAddress', {
          nftAddress: rawData[index].nft_address,
        })
        .getRawMany();

      for (let i = 0; i < listOffer.length; i++) {
        const element = listOffer[i];
        await getRepository(MarketPlaceNoticeEntity)
          .createQueryBuilder()
          .insert()
          .values({
            type: NoticeTypeEnum.USER_ACTION,
            subType: NoticeSubTypeEnum.OFFER,
            owner: userAddress,
            nftAddress: element.nft_address,
            collectionAddress: rawData[index].collection_address,
            price: element.price,
            content: NoticeContentEnum.OFFER,
            isRead: 0,
            deleted: 0,
            image: rawData[index].image_url,
            name: rawData[index].title,
            operator: element.user_address,
          })
          .execute();
      }
    }
  }
}
