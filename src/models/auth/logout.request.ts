import { IsNotEmpty } from 'class-validator';

export class LogoutRequest {
  @IsNotEmpty()
  refreshToken: string;
}
