import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserInfoModel {
  @IsOptional()
  name: string;

  @IsOptional()
  discordUrl?: string;

  @IsNotEmpty()
  twitterUrl?: string;

  @IsOptional()
  avatarUrl?: string;

  @IsOptional()
  websiteUrl?: string;
}
