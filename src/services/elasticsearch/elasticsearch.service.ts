import 'reflect-metadata';
import { ElasticsearchRepository } from '@repositories/elasticsearch/elasticsearch.respository';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class ElasticsearchService {
  constructor(
    @InjectRepository()
    private readonly ElasticsearchRepository: ElasticsearchRepository,
  ) {}

  /**
   * Migrate collection
   */
  async migrateCollection(): Promise<any> {
    return await this.ElasticsearchRepository.migrateCollection();
  }

  /**
   * Delete collection
   */
  async deleteCollection(): Promise<any> {
    return await this.ElasticsearchRepository.deleteIndex();
  }

  /**
   * Search
   */
  async search(filter): Promise<any> {
    return await this.ElasticsearchRepository.search(filter);
  }
}
