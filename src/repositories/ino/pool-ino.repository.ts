import LogInoModel from '@entities/mongo-entities/ino/log-ino.entity';
import { MintNftInoModel } from './../../models/ino/mint-nft';
import PoolINOModel from '@entities/mongo-entities/ino/pool-ino.entity';
import AccountInoModel from '@entities/mongo-entities/ino/account-ino.entity';

export class PoolInoRepository {
  private dataPool: any;

  private timeCount: number;

  constructor() {
    this.dataPool = [];
    this.timeCount = 0;
  }

  async getPool(project: string): Promise<any> {
    if (Date.now() - 10000 > this.timeCount || this.dataPool.length == 0) {
      this.timeCount = Date.now();
      this.dataPool = await PoolINOModel.find();
    }
    const data = this.dataPool.find((x: any) => x.project === project);

    return data;
  }

  async getRank(project: string, page: number, limit: number): Promise<any> {
    const point = project + '.point';
    const data = await AccountInoModel.find({
      [project]: { $exists: true },
      [point]: { $gt: 0 },
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ [point]: -1 });

    // .toArray();

    const result = [];
    if (data) {
      for (let i = 0; i < data.length; i++) {
        const temp = JSON.parse(JSON.stringify(data[i]));

        result.push({
          address: temp['address'],
          point: temp[project]['point'],
          status: temp[project]['txnID'],
        });
      }
    }

    return result;
  }

  async addPoolAndPoint(
    payload: MintNftInoModel,
    address: string,
  ): Promise<any> {
    const { project, type, inviteRefCode, txnID } = payload;
    const pointProject = project + '.point';
    const query = { project: project };
    const data = await PoolINOModel.findOneAndUpdate(
      query,
      { $inc: { [type]: 1 } },
      { upsert: true, returnDocument: 'after' },
    );

    if (inviteRefCode && inviteRefCode !== '') {
      const user1 = await AccountInoModel.findOneAndUpdate(
        {
          referalCode: inviteRefCode,
        },
        { $inc: { [pointProject]: 1 } },
        { new: true },
      );
      // console.log('user1:   ', user1);

      if (user1 && user1[project] && user1[project]['inviteRefCode']) {
        const user2 = await AccountInoModel.findOneAndUpdate(
          {
            referalCode: user1[project]['inviteRefCode'],
          },
          { $inc: { [pointProject]: 0.5 } },
          { new: true },
        );
        console.log('add point user2: ', user2);
      }

      await LogInoModel.findOneAndUpdate(
        { code: project },
        {
          $push: {
            log: {
              addressUser: address,
              txnID: txnID,
              inviteRefCode: inviteRefCode,
              timestamp: Date.now(),
            },
          },
        },
        { upsert: true },
      );
    }

    return data;
  }
}
