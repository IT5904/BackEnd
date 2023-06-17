import { NftEntity } from '@entities/postgres-entities/nft.entity';
import { NftPropertiesEntity } from '@entities/postgres-entities/nft-properties.entity';
import { NftReactEntity } from '@entities/postgres-entities/nft-react.entity';
import { EntityRepository, Repository, getRepository } from 'typeorm';
import { ApiError } from '@models/api-error';
import { StatusCodes } from 'http-status-codes';
import { ResponseCodeEnum } from '@models/enums/response-code.enum';
import {
  NftCartResponse,
  NftCollectionOfferResponse,
  NftOfferReceivedResponse,
  NftOfferResponse,
  NftResponse,
  // OfferList,
} from '@models/nft/nft-response';
import { plainToClass } from 'class-transformer';
import {
  NftExploreModel,
  NftFavoriteSearchModel,
  NftSearchModel,
} from '@models/nft/nft-search';
import { NftDataModel } from '@models/nft/nft-data';
import { UserInfo } from '@models/authorzization/user.info';
import { NFTOrderEnum } from '@models/enums/collection.enum';
import { settings } from '@config/settings';
// import moment from 'moment';
import {
  NftVerifyEnum,
  SaleStatusEnum,
} from '@models/enums/sale-nft-type.enum';
import Paging from '@core/utils/paging';
import {
  CollectionEntity,
  CollectionOfferEntity,
  OfferSaleEntity,
  UserInfoEntity,
  UserWalletEntity,
} from '@entities/postgres-entities';
import { ChainUrlEntity } from '@entities/postgres-entities/chain-url.entity';
import { JsonRpcProvider, Connection } from '@mysten/sui.js';
import RedisClient from '../../config/redis';
import genKeyRedis from '@core/utils/redis';

@EntityRepository(NftEntity)
export class NftRepository extends Repository<NftEntity> {
  /**
   * Get list nft
   */
  async getListNft(
    dataQuery: NftSearchModel,
    user: UserInfo,
  ): Promise<{ rows: NftResponse[]; nextPage: boolean }> {
    const key = genKeyRedis('nftCache', dataQuery);
    let getCache = null;
    try {
      getCache = await RedisClient.get(key);
    } catch (error) {
      console.log('Redis ERR', error);
    }
    if (getCache) {
      console.log('--Get cache Redis--', key);
      return JSON.parse(getCache);
    } else {
      const paging = Paging(dataQuery.page, dataQuery.limit);
      const query = this.createQueryBuilder('n')
        .select(
          `
          n.id,
          n.title,
          n.nft_address,
          n.collection_id,
          n.collection_address,
          n.description,
          n.max_quantity,
          n.image_url,
          n.external_link,
          n.start_price,
          n.end_price,
          n.quantity,
          n.sale_type,
          n.nft_status,
          n.reserve_buyer_id,
          n.start_time,
          n.block_timestamp,
          n.market_price,
          n.listing_price,
          n.offer_price,
          n.owner_address,
          n.creator_address,
          n.nft_status,
          n.rarity_type,
          n.ranking,
          n.version,
          (select c.verify_type from collections c where n.collection_address = c.address) AS verify,
          CASE 
            WHEN n.nft_status = 0 THEN TRUE
            ELSE FALSE
          END AS is_listing,
          COALESCE(c.name, '') AS collection_name,
          COALESCE(c.logo, '') AS collection_image,
          COALESCE(c.banner_image, '') AS collection_banner,
          COALESCE(c.floor_price, 0) AS floor_price_listing,
          c.royalty_fee AS royalty_fee,
          c.time_listing AS time_listing,
          CASE 
            WHEN n.count_react IS NULL THEN 0
            ELSE n.count_react
          END AS number_like,
          CASE 
            WHEN nr.id IS NULL THEN FALSE
            ELSE TRUE
          END AS is_like
        `,
        )
        .leftJoin(CollectionEntity, 'c', 'c.address = n.collection_address')
        .leftJoin(
          NftReactEntity,
          'nr',
          'nr.nft_address = n.nft_address AND nr.user_address = :userAddress',
          { userAddress: user ? user.walletAddress : null },
        )
        .orderBy({ 'n.nft_status': 'ASC' });

      if (dataQuery.orderBy != null) {
        switch (dataQuery.orderBy) {
          case NFTOrderEnum.PRICE_LOW_TO_HIGH: {
            query.addOrderBy('COALESCE(n.listing_price, 0)', 'ASC');

            break;
          }
          case NFTOrderEnum.PRICE_HIGH_TO_LOW: {
            query.addOrderBy('COALESCE(n.listing_price, 0)', 'DESC');

            break;
          }
          case NFTOrderEnum.NEWEST: {
            query.orderBy({
              'n.nft_status': 'ASC',
              'n.block_timestamp': 'DESC',
            });
            break;
          }
        }
      }

      if (dataQuery.status && dataQuery.status != '') {
        const filterStatus = dataQuery.status.split(',');
        const status = [];
        if (filterStatus.includes('verify')) {
          query.andWhere('c.verify_type = :verify', {
            verify: NftVerifyEnum.VERIFY,
          });
        }
        if (filterStatus.includes('buy-now')) {
          status.push(SaleStatusEnum.LISTING);
        }
        if (filterStatus.includes('not-for-sale')) {
          status.push(SaleStatusEnum.CANCEL);
        }
        if (status.length > 0) {
          query.andWhere(
            'CASE WHEN COALESCE(c.time_listing, CURRENT_TIMESTAMP) <= CURRENT_TIMESTAMP THEN n.nft_status IN (:...status::int) ELSE n.nft_status IN (:...statusTime::int) END',
            {
              status: status,
              statusTime:
                status.includes(SaleStatusEnum.LISTING) && status.length > 1
                  ? status.filter((it) => it != SaleStatusEnum.LISTING)
                  : [SaleStatusEnum.CANCEL],
            },
          );
        }
      }

      if (dataQuery.minPrice) {
        query.andWhere(`(n.listing_price)::decimal >= :minPrice`, {
          minPrice: parseFloat(dataQuery.minPrice) * Math.pow(10, 9),
        });
      }

      if (dataQuery.maxPrice) {
        query.andWhere(`(n.listing_price)::decimal <= :maxPrice`, {
          maxPrice: parseFloat(dataQuery.maxPrice) * Math.pow(10, 9),
        });
      }

      if (dataQuery.minRank || dataQuery.maxRank) {
        query.orderBy();

        if (dataQuery.minRank) {
          query
            .andWhere(`(n.ranking)::int >= :minRank`, {
              minRank: dataQuery.minRank,
            })
            .addOrderBy('n.ranking', 'ASC');
        }
        if (dataQuery.maxRank) {
          query
            .andWhere(`(n.ranking)::int <= :maxRank`, {
              maxRank: dataQuery.maxRank,
            })
            .addOrderBy('n.ranking', 'ASC');
        }
      }

      if (dataQuery.title && dataQuery.title !== '') {
        query.andWhere(`n.title ILIKE :title`, {
          title: `%${dataQuery.title}%`,
        });
      }

      if (dataQuery.isLisiting) {
        query.andWhere(`(is_listing IS TRUE)`);
      }

      if (dataQuery.collectionAddress) {
        query.andWhere(`n.collection_address = :collectionAddress`, {
          collectionAddress: dataQuery.collectionAddress,
        });
      }

      if (dataQuery.filterProperties && dataQuery.filterProperties != '') {
        const filterKey = dataQuery.filterPropertiesKey.split(',');
        const filter = JSON.parse(dataQuery.filterProperties);
        query.leftJoin(
          NftPropertiesEntity,
          'np',
          'n.nft_address = np.nft_address',
        );
        query.andWhere(
          `(np."key", np.value) IN (
            ${filter.map((pair) => `('${pair.key}','${pair.value}')`)}
          )`,
        );

        query
          .addGroupBy('n.id')
          .addGroupBy('c.name')
          .addGroupBy('c.logo')
          .addGroupBy('c.banner_image')
          .addGroupBy('c.floor_price')
          .addGroupBy('c.royalty_fee')
          .addGroupBy('c.time_listing')
          .addGroupBy('nr.id')
          .addGroupBy('n.nft_address')
          .having('COUNT(DISTINCT np."key") = :count', {
            count: filterKey.length,
          });
      }

      if (!dataQuery.limit) dataQuery.limit = settings.limit.default;

      query.offset(paging.skip).limit(paging.take);

      const newData = await query.getRawMany();
      const nextPage = newData.length < paging.take ? false : true;
      try {
        await RedisClient.setEx(
          key,
          10,
          JSON.stringify({
            rows: plainToClass(NftResponse, newData, {
              excludeExtraneousValues: true,
            }),
            nextPage,
          }),
        );
      } catch (error) {
        console.log('Redis ERR', error);
      }
      return {
        rows: plainToClass(NftResponse, newData, {
          excludeExtraneousValues: true,
        }),
        nextPage,
      };
    }
  }

  async getFavoriteNfts(
    dataQuery: NftFavoriteSearchModel,
    user: UserInfo,
  ): Promise<{ rows: NftResponse[]; nextPage: boolean }> {
    const paging = Paging(dataQuery.page, dataQuery.limit);

    const query = this.createQueryBuilder('n')
      .select(
        `
        n.id,
        n.title,
        n.nft_address,
        n.collection_id,
        n.collection_address,
        n.description,
        n.max_quantity,
        n.image_url,
        n.external_link,
        n.start_price,
        n.end_price,
        n.quantity,
        n.sale_type,
        n.nft_status,
        n.reserve_buyer_id,
        n.start_time,
        n.block_timestamp,
        n.market_price,
        n.listing_price,
        n.offer_price,
        n.owner_address,
        n.nft_status,
        n.version,
        n.rarity_type,
        n.ranking,
        (select c.verify_type from collections c where n.collection_address = c.address) AS verify,
        (select c.floor_price from collections c where n.collection_address = c.address) AS floor_price_listing,
        (select c.royalty_fee from collections c where n.collection_address = c.address) AS royalty_fee,
        (select c.time_listing from collections c where n.collection_address = c.address) AS time_listing,
        CASE 
          WHEN n.nft_status = 0 THEN TRUE
          ELSE FALSE
        END AS is_listing,
        CASE 
          WHEN n.count_react IS NULL THEN 0
          ELSE n.count_react
        END AS number_like,
        CASE 
          WHEN nr.id IS NULL THEN FALSE
          ELSE TRUE
        END AS is_like
      `,
      )
      .innerJoin(CollectionEntity, 'c', 'c.address = n.collection_address')
      .innerJoin(
        NftReactEntity,
        'nr',
        'nr.nft_address = n.nft_address AND nr.user_address = :userAddress',
        { userAddress: user ? user.walletAddress : null },
      )
      .orderBy('n.nft_status', 'ASC');
    // .addOrderBy('n.block_timestamp', 'DESC');

    if (dataQuery.status && dataQuery.status != '') {
      const filterStatus = dataQuery.status.split(',');
      const status = [];
      if (filterStatus.includes('verify')) {
        query.andWhere('c.verify_type = :verify', {
          verify: NftVerifyEnum.VERIFY,
        });
      }
      if (filterStatus.includes('buy-now')) {
        status.push(SaleStatusEnum.LISTING);
      }
      if (filterStatus.includes('not-for-sale')) {
        status.push(SaleStatusEnum.CANCEL);
      }
      if (status.length > 0) {
        query.andWhere(
          'CASE WHEN COALESCE(c.time_listing, CURRENT_TIMESTAMP) <= CURRENT_TIMESTAMP THEN n.nft_status IN (:...status::int) ELSE n.nft_status IN (:...statusTime::int) END',
          {
            status: status,
            statusTime:
              status.includes(SaleStatusEnum.LISTING) && status.length > 1
                ? status.filter((it) => it != SaleStatusEnum.LISTING)
                : [SaleStatusEnum.CANCEL],
          },
        );
      }
    } else {
      query.andWhere(
        'CASE WHEN COALESCE(c.time_listing, CURRENT_TIMESTAMP) > CURRENT_TIMESTAMP THEN n.nft_status IN (:...statusDefault::int) ELSE true END',
        {
          statusDefault: [SaleStatusEnum.CANCEL],
        },
      );
    }

    if (dataQuery.minPrice) {
      query.andWhere(`(n.listing_price)::decimal >= :minPrice`, {
        minPrice: parseFloat(dataQuery.minPrice) * Math.pow(10, 9),
      });
    }

    if (dataQuery.maxPrice) {
      query.andWhere(`(n.listing_price)::decimal <= :maxPrice`, {
        maxPrice: parseFloat(dataQuery.maxPrice) * Math.pow(10, 9),
      });
    }

    if (dataQuery.title && dataQuery.title !== '') {
      query.andWhere(`n.title ILIKE :title`, {
        title: `%${dataQuery.title}%`,
      });
    }

    if (dataQuery.isLisiting) {
      query.andWhere(`(is_listing IS TRUE)`);
    }

    if (dataQuery.collectionAddress) {
      query.andWhere(`n.collection_address = :collectionAddress`, {
        collectionAddress: dataQuery.collectionAddress,
      });
    }

    if (dataQuery.filterProperties && dataQuery.filterProperties != '') {
      const filterKey = dataQuery.filterPropertiesKey.split(',');
      const filter = JSON.parse(dataQuery.filterProperties);
      query.leftJoin(
        NftPropertiesEntity,
        'np',
        'n.nft_address = np.nft_address',
      );
      query.andWhere(
        `(np."key", np.value) IN (
            ${filter.map((pair) => `('${pair.key}','${pair.value}')`)}
          )`,
      );

      query
        .addGroupBy('n.id')
        .addGroupBy('c.name')
        .addGroupBy('c.logo')
        .addGroupBy('c.banner_image')
        .addGroupBy('c.floor_price')
        .addGroupBy('c.royalty_fee')
        .addGroupBy('c.time_listing')
        .addGroupBy('nr.id')
        .addGroupBy('n.nft_address')
        .having('COUNT(DISTINCT np."key") = :count', {
          count: filterKey.length,
        });
    }

    query.offset(paging.skip).limit(paging.take);

    if (dataQuery.orderBy != null) {
      switch (dataQuery.orderBy) {
        case NFTOrderEnum.PRICE_LOW_TO_HIGH: {
          query.addOrderBy('COALESCE(n.listing_price, 0)', 'ASC');

          break;
        }
        case NFTOrderEnum.PRICE_HIGH_TO_LOW: {
          query.addOrderBy('COALESCE(n.listing_price, 0)', 'DESC');

          break;
        }
        case NFTOrderEnum.NEWEST: {
          query.orderBy({
            'n.nft_status': 'ASC',
            'n.block_timestamp': 'DESC',
          });
          break;
        }
      }
    }

    const newData = await query.getRawMany();
    const nextPage = newData.length < paging.take ? false : true;
    return {
      rows: plainToClass(NftResponse, newData, {
        excludeExtraneousValues: true,
      }),
      nextPage,
    };
  }

  /**
   * Get explore nft
   */
  async getNftExplore(
    dataQuery: NftExploreModel,
    user: UserInfo,
  ): Promise<{ rows: NftResponse[]; nextPage: boolean }> {
    const key = genKeyRedis('exploreNFT', dataQuery);
    let getCache = null;
    try {
      getCache = await RedisClient.get(key);
    } catch (error) {
      console.log('Redis ERR', error);
    }
    if (getCache) {
      console.log('--Get cache Redis--', key);
      return JSON.parse(getCache);
    } else {
      const paging = Paging(dataQuery.page, dataQuery.limit);
      const query = this.createQueryBuilder('n')
        .select(
          `
        n.id,
        n.title,
        n.nft_address,
        n.collection_id,
        n.collection_address,
        n.description,
        n.max_quantity,
        n.image_url,
        n.external_link,
        n.start_price,
        n.end_price,
        n.quantity,
        n.sale_type,
        n.nft_status,
        n.reserve_buyer_id,
        n.start_time,
        n.block_timestamp,
        n.market_price,
        n.listing_price,
        n.offer_price,
        n.owner_address,
        n.creator_address,
        n.nft_status,
        n.version,
        n.rarity_type,
        n.ranking,
        (select c.verify_type from collections c where n.collection_address = c.address) AS verify,
        (select c.floor_price from collections c where n.collection_address = c.address) AS floor_price_listing,
        (select c.royalty_fee from collections c where n.collection_address = c.address) AS royalty_fee,
        (select c.time_listing from collections c where n.collection_address = c.address) AS time_listing,
        CASE 
          WHEN n.nft_status = 0 THEN TRUE
          ELSE FALSE
        END AS is_listing,
        CASE 
          WHEN n.count_react IS NULL THEN 0
          ELSE n.count_react
        END AS number_like,
        CASE 
          WHEN nr.id IS NULL THEN FALSE
          ELSE TRUE
        END AS is_like
      `,
        )
        .innerJoin(CollectionEntity, 'c', 'c.address = n.collection_address')
        .leftJoin(
          NftReactEntity,
          'nr',
          'nr.nft_address = n.nft_address AND nr.user_address = :userAddress',
          { userAddress: user ? user.walletAddress : null },
        )
        .orderBy('n.nft_status', 'ASC');
      // .addOrderBy('n.block_timestamp', 'DESC');

      if (dataQuery.title && dataQuery.title !== '') {
        query.andWhere(`n.title ILIKE :title`, {
          title: `%${dataQuery.title}%`,
        });
      }

      if (dataQuery.status && dataQuery.status != '') {
        const filterStatus = dataQuery.status.split(',');
        const status = [];
        if (filterStatus.includes('verify')) {
          query.andWhere('c.verify_type = :verify', {
            verify: NftVerifyEnum.VERIFY,
          });
        }
        if (filterStatus.includes('buy-now')) {
          status.push(SaleStatusEnum.LISTING);
        }
        if (filterStatus.includes('not-for-sale')) {
          status.push(SaleStatusEnum.CANCEL);
        }
        if (status.length > 0) {
          query.andWhere(
            'CASE WHEN COALESCE(c.time_listing, CURRENT_TIMESTAMP) <= CURRENT_TIMESTAMP THEN n.nft_status IN (:...status::int) ELSE n.nft_status IN (:...statusTime::int) END',
            {
              status: status,
              statusTime:
                status.includes(SaleStatusEnum.LISTING) && status.length > 1
                  ? status.filter((it) => it != SaleStatusEnum.LISTING)
                  : [SaleStatusEnum.CANCEL],
            },
          );
        }
      } else {
        query.andWhere(
          'CASE WHEN COALESCE(c.time_listing, CURRENT_TIMESTAMP) > CURRENT_TIMESTAMP THEN n.nft_status IN (:...statusDefault::int) ELSE true END',
          {
            statusDefault: [SaleStatusEnum.CANCEL],
          },
        );
      }

      if (dataQuery.minPrice) {
        query.andWhere(`(n.listing_price)::decimal >= :minPrice`, {
          minPrice: parseFloat(dataQuery.minPrice) * Math.pow(10, 9),
        });
      }

      if (dataQuery.maxPrice) {
        query.andWhere(`(n.listing_price)::decimal <= :maxPrice`, {
          maxPrice: parseFloat(dataQuery.maxPrice) * Math.pow(10, 9),
        });
      }

      if (!dataQuery.limit) dataQuery.limit = settings.limit.default;

      query.offset(paging.skip).limit(paging.take);

      if (dataQuery.orderBy != null) {
        switch (dataQuery.orderBy) {
          case NFTOrderEnum.PRICE_LOW_TO_HIGH: {
            query.addOrderBy('COALESCE(n.listing_price, 0)', 'ASC');
            break;
          }
          case NFTOrderEnum.PRICE_HIGH_TO_LOW: {
            query.addOrderBy('COALESCE(n.listing_price, 0)', 'DESC');
            break;
          }
          case NFTOrderEnum.NEWEST: {
            query.orderBy({
              'n.nft_status': 'ASC',
              'n.block_timestamp': 'DESC',
            });
            break;
          }
        }
      }

      const newData = await query.getRawMany();
      const nextPage = newData.length < paging.take ? false : true;
      try {
        await RedisClient.setEx(
          key,
          10,
          JSON.stringify({
            rows: plainToClass(NftResponse, newData, {
              excludeExtraneousValues: true,
            }),
            nextPage,
          }),
        );
      } catch (error) {
        console.log('Redis ERR', error);
      }

      return {
        rows: plainToClass(NftResponse, newData, {
          excludeExtraneousValues: true,
        }),
        nextPage,
      };
    }
  }

  async getUserNft(
    dataQuery,
    user,
    address,
  ): Promise<{ rows: NftResponse[]; nextPage: boolean }> {
    const paging = Paging(dataQuery.page, dataQuery.limit);
    const query = this.createQueryBuilder('n')
      .select(
        `
        n.id,
        n.title,
        n.nft_address,
        n.collection_id,
        n.collection_address,
        n.description,
        n.max_quantity,
        n.image_url,
        n.external_link,
        n.start_price,
        n.end_price,
        n.quantity,
        n.sale_type,
        n.reserve_buyer_id,
        n.start_time,
        n.block_timestamp,
        n.market_price,
        n.listing_price,
        n.offer_price,
        n.owner_address,
        n.creator_address,
        n.nft_status,
        n.version,
        n.rarity_type,
        n.ranking,
        (select c.verify_type from collections c where n.collection_address = c.address) AS verify,        
        COALESCE(c.name, '') AS collection_name,
        COALESCE(c.logo, '') AS collection_image,
        COALESCE(c.banner_image, '') AS collection_banner,
        COALESCE(c.floor_price, 0) AS floor_price_listing,
        c.royalty_fee AS royalty_fee,
        c.time_listing AS time_listing,
        CASE 
          WHEN n.nft_status = 0 THEN TRUE
          ELSE FALSE
        END AS is_listing,
        CASE 
          WHEN n.count_react IS NULL THEN 0
          ELSE n.count_react
        END AS number_like,
        CASE 
          WHEN nr.id IS NULL THEN FALSE
          ELSE TRUE
        END AS is_like
      `,
      )
      .innerJoin(CollectionEntity, 'c', 'c.address = n.collection_address')
      .leftJoin(
        NftReactEntity,
        'nr',
        'nr.nft_address = n.nft_address AND nr.user_address = :userAddress',
        { userAddress: user ? user.walletAddress : null },
      )
      .where('n.owner_address = :address', { address: address })
      .orderBy('n.nft_status', 'ASC');
    // .addOrderBy('n.block_timestamp', 'DESC');

    if (dataQuery.collectionAddress && dataQuery.collectionAddress != '') {
      query.andWhere('c.address IN (:...collectionAddress)', {
        collectionAddress: dataQuery.collectionAddress.split(','),
      });
    }

    if (dataQuery.status && dataQuery.status != '') {
      const filterStatus = dataQuery.status.split(',');
      const status = [];
      if (filterStatus.includes('verify')) {
        query.andWhere('c.verify_type = :verify', {
          verify: NftVerifyEnum.VERIFY,
        });
      }
      if (filterStatus.includes('listing')) {
        status.push(SaleStatusEnum.LISTING);
      }
      if (filterStatus.includes('unlisting')) {
        status.push(SaleStatusEnum.CANCEL);
      }
      if (status.length > 0) {
        query.andWhere(
          'CASE WHEN COALESCE(c.time_listing, CURRENT_TIMESTAMP) <= CURRENT_TIMESTAMP THEN n.nft_status IN (:...status::int) ELSE n.nft_status IN (:...statusTime::int) END',
          {
            status: status,
            statusTime:
              status.includes(SaleStatusEnum.LISTING) && status.length > 1
                ? status.filter((it) => it != SaleStatusEnum.LISTING)
                : [SaleStatusEnum.CANCEL],
          },
        );
      }
    }

    if (dataQuery.title && dataQuery.title !== '') {
      query.andWhere(`n.title ILIKE :title`, {
        title: `%${dataQuery.title}%`,
      });
    }

    const newData = await query
      .offset(paging.skip)
      .limit(paging.take)
      .getRawMany();

    return {
      rows: plainToClass(NftResponse, newData, {
        excludeExtraneousValues: true,
      }),
      nextPage: newData.length < paging.take ? false : true,
    };
  }

  async getPortfolioNFT(user): Promise<any> {
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, ResponseCodeEnum.CM0004);
    }
    const walletAddress = user.walletAddress;

    const queryPrice = this.createQueryBuilder('n')
      .select('SUM(COALESCE(c.floor_price, 0))', 'totalNftFloorPrice')
      .innerJoin(CollectionEntity, 'c', 'c.address = n.collection_address')
      .where('n.owner_address = :address', { address: walletAddress });
    const totalNftFloorPrice = await queryPrice.getRawOne();

    const queryCollection = this.createQueryBuilder('n')
      .select('c.name, c.address, count(n.nft_address)')
      .innerJoin(CollectionEntity, 'c', 'c.address = n.collection_address')
      .where('n.owner_address = :address', { address: walletAddress })
      .addGroupBy('c.name')
      .addGroupBy('c.address');
    const filterCollection = await queryCollection.getRawMany();
    return {
      filterCollection,
      totalNftFloorPrice: totalNftFloorPrice
        ? totalNftFloorPrice.totalNftFloorPrice
        : 0,
    };
  }

  async getMoreNft(
    dataQuery,
    user: UserInfo,
  ): Promise<{ rows: NftResponse[]; nextPage: boolean }> {
    const paging = Paging(dataQuery.page, dataQuery.limit);
    const query = this.createQueryBuilder('n')
      .select(
        `
        n.id,
        n.title,
        n.nft_address,
        n.collection_id,
        n.collection_address,
        n.description,
        n.max_quantity,
        n.image_url,
        n.external_link,
        n.start_price,
        n.end_price,
        n.quantity,
        n.sale_type,
        n.reserve_buyer_id,
        n.start_time,
        n.block_timestamp,
        n.market_price,
        n.listing_price,
        n.offer_price,
        n.owner_address,
        n.creator_address,
        n.nft_status,
        n.version,
        n.rarity_type,
        n.ranking,
        c.floor_price AS floor_price_listing,
        c.verify_type AS verify,
        c.royalty_fee  AS royalty_fee,
        c.time_listing AS time_listing,
        CASE 
          WHEN n.nft_status = 0 THEN TRUE
          ELSE FALSE
        END AS is_listing,
        CASE 
          WHEN n.count_react IS NULL THEN 0
          ELSE n.count_react
        END AS number_like,
        CASE 
          WHEN nr.id IS NULL THEN FALSE
          ELSE TRUE
        END AS is_like
      `,
      )
      .innerJoin(CollectionEntity, 'c', 'c.address = n.collection_address')
      .leftJoin(
        NftReactEntity,
        'nr',
        'nr.nft_address = n.nft_address AND nr.user_address = :userAddress',
        { userAddress: user ? user.walletAddress : null },
      )
      .where('n.nft_address != :address', { address: dataQuery.address })
      .andWhere('n.collection_address = :collectionAddress', {
        collectionAddress: dataQuery.collectionAddress,
      })
      .andWhere(
        'CASE WHEN COALESCE(c.time_listing, CURRENT_TIMESTAMP) <= CURRENT_TIMESTAMP THEN true ELSE n.nft_status IN (:...statusTime::int) END',
        {
          statusTime: [SaleStatusEnum.CANCEL],
        },
      )
      .orderBy('n.nft_status', 'ASC')
      .addOrderBy('n.block_timestamp', 'DESC');

    const rawData = await query
      .offset(paging.skip)
      .limit(paging.take)
      .getRawMany();

    return {
      rows: plainToClass(NftResponse, rawData, {
        excludeExtraneousValues: true,
      }),
      nextPage: rawData.length < paging.take ? false : true,
    };
  }

  async getNFTDetail(address: string, user: UserInfo) {
    const query = this.createQueryBuilder('n')
      .select(
        `
        n.id,
        n.title,
        n.nft_address,
        n.collection_id,
        n.collection_address,
        n.description,
        n.max_quantity,
        n.image_url,
        n.external_link,
        n.start_price,
        n.end_price,
        n.quantity,
        n.sale_type,
        n.reserve_buyer_id,
        n.start_time,
        n.block_timestamp,
        n.nft_status,
        n.market_price,
        n.listing_price,
        n.offer_price,
        n.owner_address,
        n.creator_address,
        n.version,
        n.rarity_type,
        n.ranking,
        c.verify_type AS verify,
        CASE 
          WHEN n.nft_status = 0 THEN TRUE
          ELSE FALSE
        END AS is_listing,
        CASE 
          WHEN n.count_react IS NULL THEN 0
          ELSE n.count_react
        END AS number_like,
        CASE 
          WHEN nr.id IS NOT NULL THEN TRUE
          ELSE FALSE
        END AS is_like,
        COALESCE(c.name, '') AS collection_name,
        COALESCE(c.logo, '') AS collection_image,
        COALESCE(c.banner_image, '') AS collection_banner,
        COALESCE(c.floor_price, 0) AS floor_price_listing,
        c.royalty_fee AS royalty_fee,
        c.time_listing AS time_listing,
        c.total_items,
        ARRAY (
          SELECT json_build_object(
                  'key', np.key, 
                  'value', np.value
                ) 
          FROM nft_properties np WHERE np.nft_address = n.nft_address
          ) 
        AS properties
      `,
      )
      .innerJoin(CollectionEntity, 'c', 'c.address = n.collection_address')
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select(['id', 'user_address', 'nft_address'])
            .from(NftReactEntity, 'nr')
            .where(`nr.user_address = :userAddress`, {
              userAddress: user ? user.walletAddress : null,
            });
        },
        'nr',
        'nr.nft_address = n.nft_address',
      )
      .where('n.nft_address = :address', {
        address: address,
      });

    const data = await query.getRawOne();

    if (!data) {
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0001);
    }

    const userWallet = await getRepository(UserWalletEntity)
      .createQueryBuilder('uw')
      .select(
        `
            uw.address,
            ui.avatar_url
          `,
      )
      .leftJoin(UserInfoEntity, 'ui', 'ui.id = uw.user_id')
      .where('uw.address = :address', {
        address: data.owner_address,
      })
      .getRawOne();

    data.owner_image = userWallet?.avatar_url || '';
    return data;
  }

  async likeNft(data, user: UserInfo): Promise<boolean> {
    const { nftAddress } = data;

    if (!nftAddress) {
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0001);
    }

    const check = await getRepository(NftReactEntity)
      .createQueryBuilder('nr')
      .select('*')
      .where('nr.nft_address = :nftId AND nr.user_address = :userId', {
        nftId: nftAddress,
        userId: user.walletAddress,
      })
      .getRawOne();

    if (!check) {
      await getRepository(NftReactEntity)
        .createQueryBuilder('nr')
        .insert()
        .values({
          nftAddress: nftAddress,
          userAddress: user.walletAddress,
        })
        .execute();
      await getRepository(NftEntity).query(
        `UPDATE nfts SET count_react = coalesce(count_react, 0) + 1 WHERE nft_address = '${nftAddress}'`,
      );
      return true;
    }
    await getRepository(NftReactEntity)
      .createQueryBuilder()
      .delete()
      .where('nft_address = :nftId AND user_address = :userId', {
        nftId: nftAddress,
        userId: user.walletAddress,
      })
      .execute();
    await getRepository(NftEntity).query(
      `UPDATE nfts SET count_react = coalesce(count_react, 0) - 1 WHERE nft_address = '${nftAddress}'`,
    );

    return false;
  }

  async createNft(data: NftDataModel, user: UserInfo): Promise<NftEntity> {
    if (data.id) {
      const check = await this.findOne({
        where: {
          id: data.id,
          creatorAddress: user.walletAddress,
        },
      });
      if (!check) {
        throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0001);
      }
      await this.createQueryBuilder()
        .update(NftEntity)
        .set({
          ...data,
          creatorAddress: user.walletAddress,
        })
        .where('id = :id', { id: data.id })
        .execute();

      return await this.findOne({ where: { id: data.id } });
    } else {
      const nftModel = this.create(data);
      return await this.save({
        ...nftModel,
        creatorAddress: user.walletAddress,
      });
    }
  }

  async getOfferNft(
    dataQuery,
  ): Promise<{ rows: NftOfferResponse[]; nextPage: boolean }> {
    if (!dataQuery.nftAddress) {
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0005);
    }
    const nft = await getRepository(NftEntity)
      .createQueryBuilder('n')
      .select('*')
      .where('n.nft_address = :nftAddress', {
        nftAddress: dataQuery.nftAddress,
      })
      .getRawOne();
    const paging = Paging(dataQuery.page, dataQuery.limit);
    const query = getRepository(OfferSaleEntity)
      .createQueryBuilder('os')
      .select(
        `
        os.price,
        os.status,
        os.expire_time,
        os.start_time,
        os.block_timestamp,
        os.user_address
      `,
      )
      .where('os.nft_address = :nftId', { nftId: nft.nft_address })
      .orderBy({ 'os.created_at': 'DESC' });

    const rawData = await query
      .offset(paging.skip)
      .limit(paging.take)
      .getRawMany();

    return {
      rows: plainToClass(NftOfferResponse, rawData, {
        excludeExtraneousValues: true,
      }),
      nextPage: rawData.length < paging.take ? false : true,
    };
  }

  async getCollectionOfferNft(
    dataQuery,
  ): Promise<{ rows: NftCollectionOfferResponse[]; nextPage: boolean }> {
    if (!dataQuery.collectionAddress) {
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0005);
    }
    const paging = Paging(dataQuery.page, dataQuery.limit);
    const query = getRepository(CollectionOfferEntity)
      .createQueryBuilder('co')
      .select(
        `
        co.price,
        co.status,
        co.expire_time,
        co.block_timestamp,
        co.user_address,
        co.collection_address,
        co.quantity
      `,
      )
      .where('co.collection_address = :collectionAddress', {
        collectionAddress: dataQuery.collectionAddress,
      })
      .orderBy({ 'co.block_timestamp': 'DESC' });

    const rawData = await query
      .offset(paging.skip)
      .limit(paging.take)
      .getRawMany();

    return {
      rows: plainToClass(NftCollectionOfferResponse, rawData, {
        excludeExtraneousValues: true,
      }),
      nextPage: rawData.length < paging.take ? false : true,
    };
  }

  async getUserOfferNft(
    dataQuery,
    userAddress,
  ): Promise<{ rows: NftOfferResponse[]; nextPage: boolean }> {
    if (!userAddress) {
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0005);
    }
    const paging = Paging(dataQuery.page, dataQuery.limit);
    const query = getRepository(OfferSaleEntity)
      .createQueryBuilder('os')
      .select(
        `
        os.price,
        os.status,
        os.expire_time,
        os.start_time,
        os.block_timestamp,
        os.user_address,
        n.title,
        n.nft_address,
        n.image_url
      `,
      )
      .leftJoin(NftEntity, 'n', 'n.nft_address = os.nft_address')
      .where('os.user_address = :userAddress', { userAddress: userAddress })
      .orderBy({ 'os.created_at': 'DESC' });

    const rawData = await query
      .offset(paging.skip)
      .limit(paging.take)
      .getRawMany();

    return {
      rows: plainToClass(NftOfferResponse, rawData, {
        excludeExtraneousValues: true,
      }),
      nextPage: rawData.length < paging.take ? false : true,
    };
  }

  async getUserCollectionOfferNft(
    dataQuery,
    userAddress,
  ): Promise<{ rows: NftCollectionOfferResponse[]; nextPage: boolean }> {
    if (!userAddress) {
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0005);
    }
    const paging = Paging(dataQuery.page, dataQuery.limit);
    const query = getRepository(CollectionOfferEntity)
      .createQueryBuilder('co')
      .select(
        `
        co.price,
        co.status,
        co.expire_time,
        co.block_timestamp,
        co.user_address,
        co.collection_address,
        co.quantity,
        c.name,
        c.logo,
        c.onchain_type
      `,
      )
      .leftJoin(CollectionEntity, 'c', 'c.address = co.collection_address')
      .where('co.user_address = :userAddress', {
        userAddress: userAddress,
      })
      .orderBy({ 'co.block_timestamp': 'DESC' });

    const rawData = await query
      .offset(paging.skip)
      .limit(paging.take)
      .getRawMany();

    return {
      rows: plainToClass(NftCollectionOfferResponse, rawData, {
        excludeExtraneousValues: true,
      }),
      nextPage: rawData.length < paging.take ? false : true,
    };
  }

  async getUserOfferReceivedNft(
    dataQuery,
    userAddress,
  ): Promise<{ rows: NftOfferReceivedResponse[]; nextPage: boolean }> {
    if (!userAddress) {
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0005);
    }
    const paging = Paging(dataQuery.page, dataQuery.limit);
    const query = getRepository(NftEntity)
      .createQueryBuilder('n')
      .select(
        `
        n.title,
        n.nft_address,
        n.image_url,
        n.listing_price,
        n.offer_price,
        n.market_price
      `,
      )
      .where('n.owner_address = :userAddress', { userAddress: userAddress })
      .orderBy({ 'n.created_at': 'DESC' });

    const rawData = await query
      .offset(paging.skip)
      .limit(paging.take)
      .getRawMany();

    const newData = [];
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
        os.user_address
      `,
        )
        .where('os.user_address != :userAddress', { userAddress: userAddress })
        .where('os.nft_address = :nftAddress', {
          nftAddress: rawData[index].nft_address,
        })
        .getRawMany();
      newData.push({
        ...rawData[index],
        offer_list: listOffer,
      });
    }

    return {
      rows: plainToClass(NftOfferReceivedResponse, newData, {
        excludeExtraneousValues: true,
      }),
      nextPage: newData.length < paging.take ? false : true,
    };
  }

  async getCartNft(
    dataQuery,
  ): Promise<{ rows: NftCartResponse[]; total: number }> {
    const query = this.createQueryBuilder('n')
      .select(
        `
      n.id,
      n.title,
      n.nft_address,
      n.collection_id,
      n.collection_address,
      n.description,
      n.max_quantity,
      n.image_url,
      n.external_link,
      n.start_price,
      n.end_price,
      n.quantity,
      n.sale_type,
      n.reserve_buyer_id,
      n.start_time,
      n.block_timestamp,
      n.market_price,
      n.listing_price,
      n.offer_price,
      n.owner_address,
      n.creator_address,
      n.nft_status,
      n.verify,
      n.version,
      c.name AS collection_name,
      c.logo AS collection_logo,
      c.banner_image AS collection_banner
    `,
      )
      .leftJoin(CollectionEntity, 'c', 'c.id = n.collection_id');
    if (dataQuery.nftArray && dataQuery.nftArray.length > 0) {
      query.andWhere('n.nft_address IN (:...nftArray)', {
        nftArray: dataQuery.nftArray,
      });
    }
    const rawData = await query.getRawMany();

    return {
      rows: plainToClass(NftCartResponse, rawData, {
        excludeExtraneousValues: true,
      }),
      total: 0,
    };
  }

  async refreshOwnerNFT(address: string) {
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
    const txn = await provider.getObject({
      id: address,
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

    if (txn.data.owner && txn.data.owner['ObjectOwner']) {
      const { data: details } = await provider.getObject({
        id: txn.data.owner['ObjectOwner'],
        options: {
          showType: true,
          showOwner: true,
          showPreviousTransaction: true,
          showDisplay: true,
          showContent: true,
          showBcs: true,
          showStorageRebate: true,
        },
      });

      if (!details) {
        await getRepository(NftEntity)
          .createQueryBuilder()
          .update()
          .set({
            ownerAddress: txn.data.owner['ObjectOwner'],
            updatedAt: new Date(),
          })
          .where('nft_address = :nftAddress', {
            nftAddress: address,
          })
          .execute();
        return true;
      } else {
        const ownerData = await provider.getObject({
          id: details.owner['ObjectOwner'],
          options: {
            showType: true,
            showOwner: true,
            showPreviousTransaction: true,
            showDisplay: true,
            showContent: true,
            showBcs: true,
            showStorageRebate: true,
          },
        });
        let owner = '';
        if (
          ownerData.data.type.split('::')[1] != 'tocen_marketplace' &&
          ownerData.data.type.split('::')[1] != 'tocen_stake_nft'
        ) {
          await getRepository(NftEntity)
            .createQueryBuilder()
            .update()
            .set({
              ownerAddress: ownerData.data.objectId,
              updatedAt: new Date(),
            })
            .where('nft_address = :nftAddress', {
              nftAddress: address,
            })
            .execute();
          return true;
        }
        if (
          ownerData.data['content']['fields'] &&
          ownerData.data['content']['fields'].owner_stake
        ) {
          owner = ownerData.data['content']['fields'].owner_stake;
        } else {
          owner =
            ownerData.data['content']['fields']['list_on_sale'].fields.owner;
        }

        await getRepository(NftEntity)
          .createQueryBuilder()
          .update()
          .set({
            ownerAddress: owner,
            updatedAt: new Date(),
          })
          .where('nft_address = :nftAddress', {
            nftAddress: address,
          })
          .execute();
        return true;
      }
    } else {
      await getRepository(NftEntity)
        .createQueryBuilder()
        .update()
        .set({
          ownerAddress: txn.data.owner['AddressOwner'],
          updatedAt: new Date(),
        })
        .where('nft_address = :nftAddress', { nftAddress: address })
        .execute();
      return true;
    }
  }
}
