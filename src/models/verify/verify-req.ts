import { IsNotEmpty, IsOptional } from 'class-validator';

export class VerifyReqModel {
  @IsNotEmpty()
  code: string;

  @IsOptional()
  type: string;
}
