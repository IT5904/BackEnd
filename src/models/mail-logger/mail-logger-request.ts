import { IsEmail, IsNotEmpty } from 'class-validator';

export class MailLoggerRequest {
  @IsNotEmpty()
  @IsEmail()
  from: string;

  @IsNotEmpty()
  @IsEmail()
  to: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  errorMessage: string;
}
