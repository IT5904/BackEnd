import { TocenDiscordUserRepository } from './../../repositories/ino/tocen-discord-user.repository';
import { MintNftInoModel } from './../../models/ino/mint-nft';
import { PoolInoRepository } from '@repositories/ino/pool-ino.repository';
import { AccountInoRepository } from './../../repositories/ino/account-ino.repository';
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unused-vars */
import 'reflect-metadata';
import { ApiError } from '@models/api-error';
import { Service } from 'typedi';
import { ResponseCodeEnum } from '@models/enums/response-code.enum';
import { StatusCodes } from 'http-status-codes';
import { getRepository } from 'typeorm';
import { UserInfoEntity, UserWalletEntity } from '@entities/postgres-entities';
import PoolINOModel from '@entities/mongo-entities/ino/pool-ino.entity';

@Service()
export class InoService {
  private readonly accountInoRepository: AccountInoRepository;

  private readonly tocenDiscordUserRepository: TocenDiscordUserRepository;

  private readonly poolInoRepository: PoolInoRepository;

  constructor() {
    // @InjectRepository()
    this.accountInoRepository = new AccountInoRepository();
    this.poolInoRepository = new PoolInoRepository();
    this.tocenDiscordUserRepository = new TocenDiscordUserRepository();
  }

  /**
   * Get UserINO Info
   */
  async getUserInfo(address: string): Promise<any> {
    const user = await this.accountInoRepository.getUser(address);
    if (!user)
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0008);
    return user;
  }

  /**
   * Get PoolINO Info
   */
  async getPoolInfo(project: string): Promise<any> {
    const pool = await this.poolInoRepository.getPool(project);
    if (!pool)
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0013);
    return pool;
  }

  /**
   * Get Rank INO Info
   */
  async getRankInfo(
    project: string,
    page: number,
    limit: number,
  ): Promise<any> {
    const rank = await this.poolInoRepository.getRank(project, page, limit);
    if (!rank)
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0013);
    return rank;
  }

  /**
   * Mint NFT INO
   */
  async mintNftIno(data: MintNftInoModel, address: string): Promise<any> {
    const account = await this.accountInoRepository.addInfoUser(data, address);
    const pool = await this.poolInoRepository.addPoolAndPoint(data, address);
    // const pool = await this.poolInoRepository.addPool(data);
    // const account = await this.accountInoRepository.addInfoUser(data, address);

    if (!pool || !account)
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0008);
    return { pool, account };
  }

  /**
   * calcWhitelist INO
   */
  async calcWhitelist(project: string): Promise<any> {
    const poolInfo = await this.poolInoRepository.getPool(project);

    const whitelistInfo = poolInfo.whitelistInfo;
    const addWhitelistAccount = await this.accountInoRepository.addWhitelist(
      project,
      whitelistInfo,
    );

    if (!addWhitelistAccount)
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0014);
    return addWhitelistAccount;
  }

  async addWhitelist(project: string, whitelist: string[]): Promise<any> {
    const poolInfo = await this.poolInoRepository.getPool(project);
    const oldWhitelist = poolInfo.whitelistInfo;

    const temp = [...whitelist, ...oldWhitelist];
    const newWhitelist = [...new Set(temp)];
    const res = await PoolINOModel.findOneAndUpdate(
      { project },
      { $set: { whitelistInfo: newWhitelist } },
      { new: true },
    );
    await this.accountInoRepository.addWhitelist(project, newWhitelist);
    return res;
  }

  async addPrivate(project: string, privateList: string[]): Promise<any> {
    const poolInfo = await this.poolInoRepository.getPool(project);
    const oldPrivate = poolInfo.privateInfo;

    const temp = [...privateList, ...oldPrivate];
    const newPrivate = [...new Set(temp)];
    const res = await PoolINOModel.findOneAndUpdate(
      { project },
      { $set: { privateInfo: newPrivate } },
      { new: true },
    );
    await this.accountInoRepository.addPrivate(project, newPrivate);
    return res;
  }

  async addHolder(project: string, holder: string[]): Promise<any> {
    const poolInfo = await this.poolInoRepository.getPool(project);
    const oldHolder = poolInfo.holderInfo;

    const temp = [...holder, ...oldHolder];
    const newHolder = [...new Set(temp)];
    const res = await PoolINOModel.findOneAndUpdate(
      { project },
      { $set: { holderInfo: newHolder } },
      { new: true },
    );
    await this.accountInoRepository.addHolder(project, newHolder);
    return res;
  }

  /**
   * calc holder INO
   */
  async calcHolder(project: string): Promise<any> {
    const poolInfo = await this.poolInoRepository.getPool(project);

    const holderInfo = poolInfo.holderInfo;
    const addHolderAccount = await this.accountInoRepository.addHolder(
      project,
      holderInfo,
    );

    if (!addHolderAccount)
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0014);
    return addHolderAccount;
  }

  /**
   * calc private INO
   */
  async calcPrivate(project: string): Promise<any> {
    const poolInfo = await this.poolInoRepository.getPool(project);

    const privateInfo = poolInfo.privateInfo;
    const addPrivateAccount = await this.accountInoRepository.addPrivate(
      project,
      privateInfo,
    );

    if (!addPrivateAccount)
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0014);
    return addPrivateAccount;
  }

  /**
   * verify discord
   */
  async verifyDiscord(address: string): Promise<any> {
    try {
      const discordTag = await getRepository(UserInfoEntity)
        .createQueryBuilder('ui')
        .select(`ui.id,ui.discord_url,ui.discord_verify`)
        .innerJoin(UserWalletEntity, 'uw', 'uw.user_id = ui.id')
        .where(`uw.address= :address`, {
          address: address,
        })
        .getRawOne();

      if (discordTag.discord_verify == 1) {
        return true;
      }

      const verify = await this.tocenDiscordUserRepository.verifyUser(
        discordTag.id,
        discordTag.discord_url,
      );
      return verify;
    } catch (error) {
      console.log(error);
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0002);
    }
  }

  /**
   * verify twitter
   */
  async verifyTwitter(address: string): Promise<any> {
    try {
      const verify = await this.tocenDiscordUserRepository.verifyTwitter(
        address,
      );
      return verify;
    } catch (error) {
      console.log(error);
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0002);
    }
  }

  /**
   * insert or update userINO
   */
  async insertOrUpdateUserIno(address: string): Promise<any> {
    const account = await this.accountInoRepository.insertOrUpdateUser(address);

    if (!account)
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0006);
    return account;
  }
}
