import { CollectionEntity } from '@entities/postgres-entities/collection.entity';
// import { NftPropertiesEntity } from '@entities/postgres-entities/nft-properties.entity';
import { CollectionVolumeEntity } from '@entities/postgres-entities/collection-volume.entity';
import { NftEntity } from '@entities/postgres-entities/nft.entity';
import { EntityRepository, ILike, Repository, getRepository } from 'typeorm';
import { ApiError } from '@models/api-error';
import { StatusCodes } from 'http-status-codes';
import { ResponseCodeEnum } from '../../models/enums/response-code.enum';
import Paging from '@utils/paging';
import {
  CollectionChartResponse,
  CollectionResponse,
} from '@models/collection/collection-reponse';
import { plainToClass } from 'class-transformer';
import { SaleStatusEnum } from '@models/enums/sale-nft-type.enum';
import { CrawlerStatusEntity } from '@entities/postgres-entities/crawler-status.entity';
import { JobManageEntity } from '@entities/postgres-entities/job-manage.entity';
import { CollectionStatusEnum } from '@models/enums/collection.enum';
import {
  ChainUrlEntity,
  CollectionPropertiesEntity,
  CollectionVolumeByHourEntity,
  UserWatchlistEntity,
} from '@entities/postgres-entities';
import { UserInfo } from '@models/authorzization/user.info';
// import genKeyRedis from '@core/utils/redis';
// import RedisClient from '../../config/redis';
import { JsonRpcProvider, Connection } from '@mysten/sui.js';
@EntityRepository(CollectionEntity)
export class CollectionRepository extends Repository<CollectionEntity> {
  /**
   * Get list collection
   */
  async getListCollection(
    dataQuery,
    user: UserInfo,
  ): Promise<{ rows: CollectionResponse[]; nextPage: boolean }> {
    const paging = Paging(dataQuery.page, dataQuery.limit);
    let where = {};
    let order = {};

    if (dataQuery.name && dataQuery.name !== '') {
      where = {
        ...where,
        name: ILike(`%${dataQuery.name}%`),
      };
    }

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

    const query = this.createQueryBuilder('collection')
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
        'collection.address = collection_volume.collection_address',
      )
      .leftJoin(
        UserWatchlistEntity,
        'uw',
        'uw.collection_address = collection.address AND uw.user_address = :userAddress',
        { userAddress: user ? user.walletAddress : null },
      )
      .where(where)
      .andWhere('collection.status != :status', {
        status: CollectionStatusEnum.NOT_AVAILABLE,
      })
      .offset(paging.skip)
      .limit(paging.take)
      .orderBy(order);

    const rows = await query.getRawMany();

    return {
      rows: plainToClass(CollectionResponse, rows, {
        excludeExtraneousValues: true,
      }),
      nextPage: rows.length < paging.take ? false : true,
    };
  }

  async adminCreateCollection(data): Promise<any> {
    const {
      address,
      networkType,
      creatorAddress,
      name,
      logo,
      bannerImage,
      description,
      discordUrl,
      twitterUrl,
      moduleName,
      mintEvent,
      type,
      verifyType,
      mintFunction,
      objectType,
      timeListing,
      mintTime,
      onchainType,
    } = data;
    if (!address || !networkType || !creatorAddress) {
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0005);
    }

    let collection = await getRepository(CollectionEntity)
      .createQueryBuilder('c')
      .select('*')
      .where('c.address = :address', { address: address })
      .getRawOne();

    if (!collection) {
      collection = await getRepository(CollectionEntity).save({
        address,
        networkType,
        collectionType: 0,
        creatorId: creatorAddress,
        name,
        logo,
        bannerImage,
        description,
        discordUrl,
        twitterUrl,
        verifyType,
        timeListing,
        mintTime,
        onchainType,
      });
    } else {
      await getRepository(CollectionEntity)
        .createQueryBuilder()
        .update()
        .set({
          address,
          networkType,
          collectionType: 0,
          creatorId: creatorAddress,
          name,
          logo,
          bannerImage,
          description,
          discordUrl,
          twitterUrl,
          verifyType,
          status: 0,
          timeListing,
          mintTime,
          onchainType,
        })
        .where('address = :address', { address: address })
        .execute();
    }

    const crawler = await getRepository(CrawlerStatusEntity)
      .createQueryBuilder('cs')
      .select('*')
      .where('cs.contract_address = :contractAddress', {
        contractAddress: address,
      })
      .getRawOne();

    if (crawler) {
      await getRepository(CrawlerStatusEntity)
        .createQueryBuilder()
        .update()
        .set({
          contractName: 'collection',
          contractAddress: address,
          moduleName: moduleName,
          type: type ? type : 'internal',
          mintEvent,
          mintFunction,
          objectType,
        })
        .where('contract_address = :address', { address: address })
        .execute();
    } else {
      await getRepository(CrawlerStatusEntity)
        .createQueryBuilder()
        .insert()
        .values({
          contractName: 'collection',
          contractAddress: address,
          moduleName: moduleName,
          type: type ? type : 'internal',
          mintEvent,
          mintFunction,
          objectType,
        })
        .execute();
    }

    const job = await getRepository(JobManageEntity)
      .createQueryBuilder('jm')
      .select('*')
      .where('jm.contract_address = :contractAddress', {
        contractAddress: address,
      })
      .getRawOne();

    if (job) {
      await getRepository(JobManageEntity)
        .createQueryBuilder()
        .update()
        .set({
          contractName: 'collection',
          contractAddress: address,
          type: type ? type : 'internal',
        })
        .where('contract_address = :address', { address: address })
        .execute();
    } else {
      await getRepository(JobManageEntity)
        .createQueryBuilder()
        .insert()
        .values({
          contractName: 'collection',
          contractAddress: address,
          type: type ? type : 'internal',
          status: 0,
        })
        .execute();
    }

    const volume = await getRepository(CollectionVolumeEntity).findOne({
      where: { collectionAddress: address },
    });

    if (volume) {
      await getRepository(CollectionVolumeEntity)
        .createQueryBuilder()
        .update()
        .set({
          floorPrice: '0',
          totalVolume: '0',
          volume1d: '0',
          volume1m: '0',
          volume7d: '0',
          volume1h: '0',
          floorPrice1d: '0',
          floorPrice1m: '0',
          floorPrice7d: '0',
          floorPrice1h: '0',
          percentageFloor1d: '0',
          percentageFloor1m: '0',
          percentageFloor1h: '0',
          percentageFloor7d: '0',
          percentageVolume1d: '0',
          percentageVolume1h: '0',
          percentageVolume1m: '0',
          percentageVolume7d: '0',
          collectionAddress: address,
          prevVolume: '0',
        })
        .where('collection_address = :address', { address: address })
        .execute();
    } else {
      await getRepository(CollectionVolumeEntity)
        .createQueryBuilder()
        .insert()
        .values({
          collectionId: collection.id,
          floorPrice: '0',
          totalVolume: '0',
          volume1d: '0',
          volume1m: '0',
          volume7d: '0',
          volume1h: '0',
          floorPrice1d: '0',
          floorPrice1m: '0',
          floorPrice7d: '0',
          floorPrice1h: '0',
          percentageFloor1d: '0',
          percentageFloor1m: '0',
          percentageFloor1h: '0',
          percentageFloor7d: '0',
          percentageVolume1d: '0',
          percentageVolume1h: '0',
          percentageVolume1m: '0',
          percentageVolume7d: '0',
          collectionAddress: address,
          prevVolume: '0',
        })
        .execute();
    }

    return true;
  }

  async updateInfoCollection(dataBody): Promise<any> {
    const { address } = dataBody;

    const collection = await getRepository(CollectionEntity)
      .createQueryBuilder('c')
      .select('*')
      .where('c.address = :address', { address: address })
      .getRawOne();

    if (!collection) {
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0001);
    }

    await getRepository(CollectionEntity)
      .createQueryBuilder()
      .update()
      .set(dataBody)
      .where('address = :address', { address: address })
      .execute();

    return true;
  }

  async getDetailCollection(
    dataQuery,
    user: UserInfo,
  ): Promise<CollectionResponse> {
    const query = this.createQueryBuilder('collection')
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
          collection.verify_type,
          collection.time_listing,
          collection.created_at,
          collection.updated_at,
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
          collection.floor_price AS floor_price_listing,
          collection_volume.prev_volume,
          CASE 
            WHEN uw.id IS NOT NULL THEN TRUE
            ELSE FALSE
          END AS is_like
        `,
      )
      .leftJoin(
        CollectionVolumeEntity,
        'collection_volume',
        'collection.address = collection_volume.collection_address',
      )
      .leftJoin(
        UserWatchlistEntity,
        'uw',
        'uw.collection_address = collection.address AND uw.user_address = :userAddress',
        { userAddress: user ? user.walletAddress : null },
      )
      .where({
        address: dataQuery.address,
      })
      .andWhere('collection.status != :status', {
        status: CollectionStatusEnum.NOT_AVAILABLE,
      });
    const check = await query.getRawOne();
    if (!check) {
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0001);
    }
    const listings = await getRepository(NftEntity)
      .createQueryBuilder('n')
      .select('*')
      .where(
        'n.collection_address = :collectionId AND n.nft_status = :status',
        {
          collectionId: check.address,
          status: SaleStatusEnum.LISTING,
        },
      )
      .getCount();

    check.listings = listings || 0;

    const rarity = await getRepository(NftEntity)
      .createQueryBuilder('n')
      .select('n.total_rarity_score')
      .where(
        'n.collection_address = :collectionId AND n.total_rarity_score IS NOT NULL',
        {
          collectionId: check.address,
        },
      )
      .getRawOne();
    check.rarity = rarity ? true : false;

    const propertiesData = await getRepository(CollectionPropertiesEntity)
      .createQueryBuilder('cp')
      .select(
        `
        cp.collection_address,
        cp.properties
    `,
      )
      .where('cp.collection_address = :address', {
        address: dataQuery.address,
      })
      .getRawOne();

    check.filter_properties =
      propertiesData && propertiesData.properties
        ? JSON.parse(propertiesData.properties).output
        : [];

    return plainToClass(CollectionResponse, check, {
      excludeExtraneousValues: true,
    });
  }

  async getCollectionChart(dataQuery): Promise<CollectionChartResponse[]> {
    let query = getRepository(CollectionVolumeByHourEntity)
      .createQueryBuilder('cvbh')
      .select(
        `
        cvbh.total_volume,
        cvbh.floor_price,
        cvbh.total_sales,
        cvbh.log_timestamp
        `,
      )
      .where('cvbh.collection_address = :address', {
        address: dataQuery.address,
      })
      .orderBy('coalesce(cvbh.log_timestamp,0)', 'DESC');

    if (dataQuery.getBy && dataQuery.getBy == 'week-time') {
      query = getRepository(CollectionVolumeByHourEntity)
        .createQueryBuilder('cvbh')
        .select(
          `
            sum(total_volume ) as total_volume,
            min(floor_price) as floor_price,
            sum(total_sales) as total_sales,
            week_time as log_timestamp
          `,
        )
        .where('cvbh.collection_address = :address', {
          address: dataQuery.address,
        })
        .groupBy('cvbh.week_time')
        .orderBy('coalesce(cvbh.week_time,0)', 'DESC');
    }

    if (dataQuery.getBy && dataQuery.getBy == 'day-time') {
      query = getRepository(CollectionVolumeByHourEntity)
        .createQueryBuilder('cvbh')
        .select(
          `
            sum(total_volume ) as total_volume,
            min(floor_price) as floor_price,
            sum(total_sales) as total_sales,
            day_time  as log_timestamp
          `,
        )
        .where('cvbh.collection_address = :address', {
          address: dataQuery.address,
        })
        .groupBy('cvbh.day_time ')
        .orderBy('coalesce(cvbh.day_time,0) ', 'DESC');
    }

    if (dataQuery.limit) {
      query.limit(dataQuery.limit);
    }

    const data = await query.getRawMany();
    return plainToClass(CollectionChartResponse, data, {
      excludeExtraneousValues: true,
    });
  }

  async updateOnchainType(): Promise<boolean> {
    const list_collection = await getRepository(CollectionEntity)
      .createQueryBuilder('c')
      .select('*')
      .where('c.status != -1')
      .getRawMany();

    const chainUrl = await getRepository(ChainUrlEntity)
      .createQueryBuilder()
      .select(
        `
        chain_url,
        status
      `,
      )
      .where('status = 0')
      .getRawOne();

    const connection = new Connection({
      fullnode: chainUrl.chain_url,
    });
    const provider = new JsonRpcProvider(connection);
    for (const iterator of list_collection) {
      console.log('collection', iterator.address);

      const nft = await getRepository(NftEntity)
        .createQueryBuilder('n')
        .select('*')
        .where('n.collection_address = :collectionAddress', {
          collectionAddress: iterator.address,
        })
        .getRawOne();
      if (nft) {
        console.log('nft', nft.nft_address);
        const dataOnchain = await provider.getObject({
          id: nft.nft_address,
          options: {
            showType: true,
            showOwner: true,
            showPreviousTransaction: true,
            showDisplay: false,
            showContent: true,
            showBcs: false,
            showStorageRebate: true,
          },
        });
        console.log(dataOnchain);
        if (dataOnchain && dataOnchain.data && dataOnchain.data.type) {
          await getRepository(CollectionEntity)
            .createQueryBuilder()
            .update()
            .set({ onchainType: dataOnchain.data.type })
            .where('address = :address', { address: iterator.address })
            .execute();
        }
      }
    }
    return true;
  }
}
