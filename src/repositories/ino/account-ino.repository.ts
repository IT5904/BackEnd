import { genCode } from '@core/utils/genRandom';
import { MintNftInoModel } from './../../models/ino/mint-nft';
// import { IAccountINO } from './../../entities/mongo-entities/ino/account-ino.interface';
import AccountInoModel, {
  AccountINOSchema,
} from '@entities/mongo-entities/ino/account-ino.entity';

export class AccountInoRepository {
  async getUser(address: string): Promise<any> {
    const data = await AccountInoModel.findOne({
      address: address,
    });

    return data;
  }

  async insertOrUpdateUser(address: string): Promise<any> {
    const data = await AccountInoModel.findOneAndUpdate(
      {
        address: address,
      },
      {
        $set: { address: address },
      },
      { upsert: true, new: true },
    );

    return data;
  }

  async addInfoUser(payload: MintNftInoModel, address: string): Promise<any> {
    const { project, type, inviteRefCode } = payload;
    const query = { address: address };
    const typePrj = project + '.' + type;
    const invitePrj = project + '.inviteRefCode';

    AccountINOSchema.add({
      [project]: {
        type: Object,
        required: false,
        unique: false,
      },
    });

    const data = await AccountInoModel.findOneAndUpdate(
      query,
      { $inc: { [typePrj]: 1 }, $set: { [invitePrj]: inviteRefCode } },
      { upsert: true, returnDocument: 'after', new: true },
    );

    if (!data['referalCode']) {
      const code = genCode(address);
      await AccountInoModel.findOneAndUpdate(
        query,
        { $set: { referalCode: code } },
        { returnDocument: 'after', new: true },
      );
    }

    return data;
  }

  async addWhitelist(project: string, whitelistInfo: string[]): Promise<any> {
    const query = {
      address: { $in: whitelistInfo },
    };

    const type = project + '.isWhitelist';

    for (let i = 0; i < whitelistInfo.length; i++) {
      await AccountInoModel.updateOne(
        { address: whitelistInfo[i] },
        { $set: { address: whitelistInfo[i] } },
        { upsert: true },
      );
    }

    AccountINOSchema.add({
      [type]: {
        type: Boolean,
        required: false,
        unique: false,
      },
    });

    const whitelist = await AccountInoModel.updateMany(
      query,
      { $set: { [type]: true } },
      { new: true, upsert: true },
    );
    console.log('whitelist', whitelist);

    const blacklist = await AccountInoModel.updateMany(
      {
        address: { $nin: whitelistInfo },
        // [project]: { $exists: true },
      },
      { $set: { [type]: false } },
      { new: true },
    );

    return { whitelist, blacklist };
  }

  async addHolder(project: string, holderInfo: string[]): Promise<any> {
    const query = {
      address: { $in: holderInfo },
    };

    const type = project + '.isHolder';

    for (let i = 0; i < holderInfo.length; i++) {
      await AccountInoModel.updateOne(
        { address: holderInfo[i] },
        { $set: { address: holderInfo[i] } },
        { upsert: true },
      );
    }

    AccountINOSchema.add({
      [type]: {
        type: Boolean,
        required: false,
        unique: false,
      },
    });

    const holder = await AccountInoModel.updateMany(
      query,
      { $set: { [type]: true } },
      { new: true, upsert: true },
    );
    console.log('holder', holder);

    const blacklist = await AccountInoModel.updateMany(
      {
        address: { $nin: holderInfo },
        // [project]: { $exists: true },
      },
      { $set: { [type]: false } },
      { new: true },
    );

    return { holder, blacklist };
  }

  async addPrivate(project: string, privateInfo: string[]): Promise<any> {
    const query = {
      address: { $in: privateInfo },
    };

    const type = project + '.isPrivate';
    // await Promise.all(
    //   privateInfo.map((x) => {
    //     AccountInoModel.updateOne(
    //       { address: x },
    //       { $set: { address: x } },
    //       { upsert: true },
    //     );
    //   }),
    // );
    // console.log(privateInfo.length);

    for (let i = 0; i < privateInfo.length; i++) {
      await AccountInoModel.updateOne(
        { address: privateInfo[i] },
        { $set: { address: privateInfo[i] } },
        { upsert: true },
      );
    }

    AccountINOSchema.add({
      [type]: {
        type: Boolean,
        required: false,
        unique: false,
      },
    });

    const result = await AccountInoModel.updateMany(
      query,
      { $set: { [type]: true } },
      { new: true, upsert: true },
    );
    console.log(result);

    const blacklist = await AccountInoModel.updateMany(
      {
        address: { $nin: privateInfo },
      },
      { $set: { [type]: false } },
      { new: true },
    );

    return { result, blacklist };
  }
}
