import { NetworkTypeEnum } from '@models/enums/netwok.enum';
import {
  IsOptional,
  IsEmail,
  IsNotEmpty,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { OperationTypeEnum } from '../enums/operation-type.enum';

export class UserPostgresCreateRequest {
  @ValidateIf((user) => user.operationTypeEnum !== OperationTypeEnum.REGISTER)
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  @ValidateIf((user) => user.operationTypeEnum !== OperationTypeEnum.REGISTER)
  @IsNotEmpty()
  address: string;

  @ValidateIf((user) => user.operationTypeEnum !== OperationTypeEnum.REGISTER)
  @IsEnum(NetworkTypeEnum)
  networkType: NetworkTypeEnum;

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

  @ValidateIf((user) => user.operationTypeEnum === OperationTypeEnum.REGISTER)
  @IsNotEmpty()
  signature: string;

  @IsNotEmpty()
  @IsEnum(OperationTypeEnum)
  operationTypeEnum: OperationTypeEnum;
}
