import { NewCollectionActivityModel } from './../../models/collection/collection-activity';
import { CollectionActivityEntity } from './../../entities/postgres-entities/collection-activity.entity';
import { EntityRepository, Repository } from 'typeorm';
import { ApiError } from '@models/api-error';
import { StatusCodes } from 'http-status-codes';
import { ResponseCodeEnum } from '@models/enums/response-code.enum';

@EntityRepository(CollectionActivityEntity)
export class CollectionActivityRepository extends Repository<CollectionActivityEntity> {
  async listNft(
    data: NewCollectionActivityModel,
  ): Promise<CollectionActivityEntity> {
    if (data.id) {
      const check = await this.findOne({
        where: {
          id: data.id,
        },
      });
      if (!check) {
        throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0001);
      }
      await this.createQueryBuilder()
        .update(CollectionActivityEntity)
        .set({
          ...data,
        })
        .where('id = :id', { id: data.id })
        .execute();

      return await this.findOne({ where: { id: data.id } });
    } else {
      const collectionActivityModel = this.create({ ...data });
      return await this.save({
        ...collectionActivityModel,
      });
    }
  }
}
