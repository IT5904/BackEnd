import { NetworkTypeEnum } from '@models/enums/netwok.enum';
import { Expose } from 'class-transformer';

export class UserInfoResponse {
  id: number;

  @Expose({ name: 'name' })
  userName: string;

  @Expose({ name: 'user_id' })
  userId: number;

  address: string;

  @Expose({ name: 'network_type' })
  networkType: NetworkTypeEnum;

  email: string;

  @Expose({ name: 'discord_url' })
  discordUrl: string;

  @Expose({ name: 'twitter_url' })
  twitterUrl: string;

  @Expose({ name: 'discord_verify' })
  discordVerify: number;

  @Expose({ name: 'twitter_verify' })
  twitterVerify: number;

  @Expose({ name: 'avatar_url' })
  avatarUrl: string;

  @Expose({ name: 'cover_url' })
  coverUrl: string;
}
