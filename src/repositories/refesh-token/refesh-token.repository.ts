import RefreshTokenModel from '@entities/mongo-entities/refresh-token/refresh-token.entity';
import { IRefreshToken } from '@entities/mongo-entities/refresh-token/refresh-token.interface';
import { UserInfo } from '@models/authorzization/user.info';
import { TimeUtils } from '@core/utils/time-utils';
import { config } from '@config/app';
import { v4 as uuid } from 'uuid';

export class RefeshTokenRepository {
  /**
   * Create refesh token document
   */
  async createRefreshToken(user: UserInfo): Promise<string> {
    const token = uuid();
    await RefreshTokenModel.deleteMany({
      authenticationId: this.generateAuthenticationId(user),
    });
    await RefreshTokenModel.create({
      token: token,
      TTL: TimeUtils.nextSeconds(
        Number(config.refresh_expires_in || 24 * 3600),
      ),
      authenticationId: this.generateAuthenticationId(user),
    });

    return token;
  }

  async updateRefreshToken(refeshToken: string): Promise<IRefreshToken> {
    const filter = {
      token: refeshToken,
    };

    const update = {
      TTL: TimeUtils.nextSeconds(
        Number(config.refresh_expires_in || 24 * 3600),
      ),
    };
    return await RefreshTokenModel.findOneAndUpdate(filter, update);
  }

  async getRefeshToken(token: string): Promise<IRefreshToken> {
    const refesh = await RefreshTokenModel.findOne({
      token: token,
      TTL: { $gt: TimeUtils.currentSeconds() },
    });

    return refesh ? refesh : null;
  }

  async deleteRefreshToken(token: string) {
    await RefreshTokenModel.deleteOne({
      token: token,
    });
  }

  generateAuthenticationId(user: UserInfo) {
    if (!user) {
      return 'Anonymous';
    }

    return `${user.id}:${user.walletAddress}`;
  }
}
