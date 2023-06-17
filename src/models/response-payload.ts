import { ResponseCodeEnum } from './enums/response-code.enum';
import { ResponseTypeEnum } from './enums/response-type.enum';

export interface ResponsePayload<T> {
  type: ResponseTypeEnum;
  code?: ResponseCodeEnum;
  message?: string;
  data?: T;
  meta?: unknown;
  __debug__?: unknown;
}
