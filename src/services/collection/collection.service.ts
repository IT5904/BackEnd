import 'reflect-metadata';
import { CollectionRepository } from '@repositories/collection/collection.respository';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import {
  CollectionChartResponse,
  CollectionResponse,
} from '@models/collection/collection-reponse';
import { UserInfo } from '@models/authorzization/user.info';

@Service()
export class CollectionService {
  constructor(
    @InjectRepository()
    private readonly collectionRepository: CollectionRepository,
  ) {}

  /**
   * Get list collection
   */
  async getListCollection(
    dataQuery,
    user: UserInfo,
  ): Promise<{ rows: CollectionResponse[]; nextPage: boolean }> {
    return await this.collectionRepository.getListCollection(dataQuery, user);
  }

  /**
   * Get detail collection
   */
  async getDetailCollection(
    dataQuery,
    user: UserInfo,
  ): Promise<CollectionResponse> {
    return await this.collectionRepository.getDetailCollection(dataQuery, user);
  }

  /**
   * Get chart collection
   */
  async getCollectionChart(dataQuery): Promise<CollectionChartResponse[]> {
    return await this.collectionRepository.getCollectionChart(dataQuery);
  }

  /**
   * Update collection
   */
  async updateInfoCollection(data): Promise<any> {
    return await this.collectionRepository.updateInfoCollection(data);
  }

  /**
   * Admin Update collection
   */
  async adminCreateCollection(data): Promise<any> {
    return await this.collectionRepository.adminCreateCollection(data);
  }

  async updateOnchainType(): Promise<any> {
    return await this.collectionRepository.updateOnchainType();
  }
}
