import { IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class NewUserInfoModel {
  @IsOptional()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  discordUrl?: string;

  @IsOptional()
  twitterUrl?: string;

  @IsOptional()
  avatarUrl?: string;

  @IsOptional()
  coverUrl?: string;
}
