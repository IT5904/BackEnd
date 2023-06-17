import { CollectionActivityEntity } from '@entities/postgres-entities/collection-activity.entity';
import { Repository, EntityRepository } from 'typeorm';
import { ActivitySearchRequest } from '@models/activity/activity-search.request';
import { plainToClass } from 'class-transformer';
import { CollectionActivitySearchTypeEnum } from '@models/enums/collection.enum';
import { ActivityResponse } from '@models/activity/activity.response';
import { NftEntity } from '@entities/postgres-entities';
import Paging from '@core/utils/paging';

@EntityRepository(CollectionActivityEntity)
export class CollectionActivityRepository extends Repository<CollectionActivityEntity> {
  async getCollectionActivity(
    dataQuery: ActivitySearchRequest,
  ): Promise<{ rows: ActivityResponse[]; nextPage: boolean }> {
    const paging = Paging(dataQuery.page, dataQuery.limit);
    const queryBuilder = this.createQueryBuilder('ca')
      .select(
        `
      ca.from_address,
      ca.user_address,
      ca.activity,
      ca.transaction_id,
      ca.timestamp,
      ca.price,
      ca.expire_time,
      ca.quantity,
      n.title,
      n.nft_address,
      n.image_url
      `,
      )
      .leftJoin(NftEntity, 'n', 'ca.nft_address = n.nft_address')
      .where(`ca.nft_address != :nftAddress`, {
        nftAddress:
          '0x4679be8a06e0fccb6c1a7f1ab3a8a372fe9b5813b25c1e5bc4090e094f08e226',
      });

    switch (dataQuery.searchBy) {
      case CollectionActivitySearchTypeEnum.COLLECTION: {
        queryBuilder.andWhere('ca.collection_address = :address', {
          address: dataQuery.address,
        });

        break;
      }

      case CollectionActivitySearchTypeEnum.NFT: {
        queryBuilder.andWhere('ca.nft_address = :address', {
          address: dataQuery.address,
        });

        break;
      }
      case CollectionActivitySearchTypeEnum.USER: {
        queryBuilder.andWhere(
          '(ca.from_address = :address OR ca.user_address = :address)',
          {
            address: dataQuery.userAddress,
          },
        );

        break;
      }

      default: {
        break;
      }
    }

    const activityType = dataQuery.activityType ? dataQuery.activityType : [];

    if (activityType.length > 0) {
      queryBuilder.andWhere(
        `
      ca.activity IN (:...type)`,
        {
          type: activityType,
        },
      );
    }

    queryBuilder.orderBy('ca.timestamp', 'DESC');
    queryBuilder.offset(paging.skip).limit(paging.take);

    const dataRaw = await queryBuilder.getRawMany();
    const data = plainToClass(ActivityResponse, dataRaw);
    return {
      rows: data,
      nextPage: dataRaw.length < paging.take ? false : true,
    };
  }
}
