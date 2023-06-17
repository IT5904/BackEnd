import { IsOptional, IsEmail, IsNotEmpty } from 'class-validator';

export class UserCreateRequest {
  @IsOptional()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  address: string;

  @IsOptional()
  description: string;
}
