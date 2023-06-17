import 'reflect-metadata';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CollectionActivityRepository } from '@repositories/activity/activity.repository';
import { ActivitySearchRequest } from '@models/activity/activity-search.request';
import { ActivityResponse } from '../../models/activity/activity.response';

@Service()
export class ActivityService {
  constructor(
    @InjectRepository()
    private readonly activityRepository: CollectionActivityRepository,
  ) {}

  /**
   * Get list activity
   */
  async getListActivity(
    dataQuery: ActivitySearchRequest,
  ): Promise<{ rows: ActivityResponse[]; nextPage: boolean }> {
    return await this.activityRepository.getCollectionActivity(dataQuery);
  }
}
