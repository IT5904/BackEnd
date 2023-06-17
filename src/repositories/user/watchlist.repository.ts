import { UserWatchlistEntity } from '@entities/postgres-entities/user-watchlist.entity';
import { EntityRepository, Repository, getRepository } from 'typeorm';
import { UserInfo } from '@models/authorzization/user.info';
import { WatchlistUpdateModel } from '@models/watchlist/watchlist-update';
import {
  CollectionEntity,
  CollectionVolumeEntity,
} from '@entities/postgres-entities';
import Paging from '@core/utils/paging';
import { WatchlistSearchModel } from '@models/watchlist/watchlist-search';
import { CollectionResponse } from '@models/collection/collection-reponse';
import { plainToClass } from 'class-transformer';
import { CollectionStatusEnum } from '@models/enums/collection.enum';

@EntityRepository(UserWatchlistEntity)
export class UserWatchlistRepository extends Repository<UserWatchlistEntity> {
  /**
   * Get list user
   */
  async getUserWatchlist(
    dataQuery: WatchlistSearchModel,
    user: UserInfo,
  ): Promise<{ rows: CollectionResponse[]; nextPage: boolean }> {
    const paging = Paging(dataQuery.page, dataQuery.limit);
    let order = {};
    if (dataQuery.typeFilter) {
      switch (dataQuery.typeFilter) {
        case 'highest-floor': {
          if (dataQuery.time == '1h') {
            order = {
              ...order,
              'coalesce((collection_volume.floor_price_1h)::DECIMAL,0)': 'DESC',
            };
          }
          if (dataQuery.time == '1d') {
            order = {
              ...order,
              'coalesce((collection_volume.floor_price_1d)::DECIMAL,0)': 'DESC',
            };
          }
          if (dataQuery.time == '7d') {
            order = {
              ...order,
              'coalesce((collection_volume.floor_price_7d)::DECIMAL,0)': 'DESC',
            };
          }
          if (dataQuery.time == '1m') {
            order = {
              ...order,
              'coalesce((collection_volume.floor_price_1m)::DECIMAL,0)': 'DESC',
            };
          }
          break;
        }
        case 'highest-sale': {
          if (dataQuery.time == '1h') {
            order = {
              ...order,
              'coalesce((collection_volume.sales_1h)::DECIMAL,0)': 'DESC',
            };
          }
          if (dataQuery.time == '1d') {
            order = {
              ...order,
              'coalesce((collection_volume.sales_1d)::DECIMAL,0)': 'DESC',
            };
          }
          if (dataQuery.time == '7d') {
            order = {
              ...order,
              'coalesce((collection_volume.sales_7d)::DECIMAL,0)': 'DESC',
            };
          }
          if (dataQuery.time == '1m') {
            order = {
              ...order,
              'coalesce((collection_volume.sales_1m)::DECIMAL,0)': 'DESC',
            };
          }
          break;
        }
        case 'highest-volume': {
          order = {
            ...order,
            'coalesce((collection_volume.total_volume)::DECIMAL,0)': 'DESC',
          };
          break;
        }
      }
    }
    const query = getRepository(UserWatchlistEntity)
      .createQueryBuilder('uw')
      .select(
        `
        collection.id,
        collection.name,
        collection.discord_url,
        collection.twitter_url,
        collection.description,
        collection.address,
        collection.banner_image,
        collection.logo,
        collection.royalty_fee,
        collection.network_type,
        collection.collection_type,
        collection.creator_id,
        collection.owners,
        collection.total_items,
        collection.time_listing,
        collection.created_at,
        collection.updated_at,
        collection.verify_type,
        collection_volume.floor_price_1h,
        collection_volume.floor_price_1d,
        collection_volume.floor_price_7d,
        collection_volume.floor_price_1m,
        collection_volume.volume_1h,
        collection_volume.volume_1d,
        collection_volume.volume_7d,
        collection_volume.volume_1m,
        collection_volume.percentage_volume_1h,
        collection_volume.percentage_volume_1d,
        collection_volume.percentage_volume_7d,
        collection_volume.percentage_volume_1m,
        collection_volume.percentage_floor_1h,
        collection_volume.percentage_floor_1d,
        collection_volume.percentage_floor_7d,
        collection_volume.percentage_floor_1m,
        collection_volume.sales_1h,
        collection_volume.sales_1d,
        collection_volume.sales_7d,
        collection_volume.sales_1m,
        collection_volume.percentage_sales_1h,
        collection_volume.percentage_sales_1d,
        collection_volume.percentage_sales_7d,
        collection_volume.percentage_sales_1m,
        collection_volume.total_sales,
        collection_volume.total_volume,
        collection_volume.floor_price,
        collection_volume.prev_volume,
        collection.floor_price AS floor_price_listing,
        CASE 
          WHEN uw.id IS NOT NULL THEN TRUE
          ELSE FALSE
        END AS is_like
    `,
      )
      .leftJoin(
        CollectionVolumeEntity,
        'collection_volume',
        'uw.collection_address = collection_volume.collection_address',
      )
      .innerJoin(
        CollectionEntity,
        'collection',
        'collection.address = uw.collection_address',
      )
      .where(`uw.user_address = :userAddress`, {
        userAddress: user.walletAddress,
      })
      .andWhere('collection.status != :status', {
        status: CollectionStatusEnum.NOT_AVAILABLE,
      });

    const rows = await query
      .offset(paging.skip)
      .limit(paging.take)
      .orderBy(order)
      .getRawMany();
    const nextPage = rows.length < paging.take ? false : true;

    return {
      rows: plainToClass(CollectionResponse, rows, {
        excludeExtraneousValues: true,
      }),
      nextPage,
    };
  }

  async addAndRemoveUserWatchlist(
    dataBody: WatchlistUpdateModel,
    user: UserInfo,
  ): Promise<boolean> {
    const check = await this.findOne({
      where: {
        userAddress: user.walletAddress,
        collectionAddress: dataBody.collectionAddress,
      },
    });

    if (check) {
      await this.delete({
        userAddress: user.walletAddress,
        collectionAddress: dataBody.collectionAddress,
      });
      return true;
    } else {
      await this.insert({
        userAddress: user.walletAddress,
        collectionAddress: dataBody.collectionAddress,
      });
      return true;
    }
  }
}
