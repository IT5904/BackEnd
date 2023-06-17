import { IsNotEmpty } from 'class-validator';

export class AuthDiscordRequest {
  @IsNotEmpty()
  code: string;
}
