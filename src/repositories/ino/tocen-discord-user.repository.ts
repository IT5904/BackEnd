import {
  TocenUserDiscordEntity,
  UserInfoEntity,
} from '@entities/postgres-entities';
import { Repository, getConnection, getRepository } from 'typeorm';

export class TocenDiscordUserRepository extends Repository<TocenUserDiscordEntity> {
  async verifyUser(id: string, tag: string): Promise<boolean> {
    const res = await getRepository(TocenUserDiscordEntity)
      .createQueryBuilder('tud')
      .select(`*`)
      .where(`tag = :tag`, {
        tag: tag,
      })
      .getRawOne();

    if (res) {
      await getRepository(UserInfoEntity)
        .createQueryBuilder('ui')
        .update(UserInfoEntity)
        .set({
          discordVerify: 1,
        })
        .where('id = :id', { id: id })
        .execute();
    }
    return !!res;
  }

  async verifyTwitter(address: string): Promise<boolean> {
    const res = await getConnection().manager.query(
      `SELECT public.tocen_user_twitter_verify_check($1)`,
      [address],
    );

    return res[0]?.tocen_user_twitter_verify_check > 0;
  }
}
