import { ValidationError } from 'class-validator';
import { ResponseCodeEnum } from './enums/response-code.enum';
import { ResponseTypeEnum } from './enums/response-type.enum';

export interface BaseResponse<E> {
  type: ResponseTypeEnum;
  message?: string;
  code?: ResponseCodeEnum;
  data?: E;
  meta?: unknown;
  nextPageToken?: string;
  errors?: ValidationError[];
}
