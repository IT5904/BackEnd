import { logger } from '@core/logger';
import { StatusCodes } from 'http-status-codes';
import { Context, Middleware, Next } from 'koa';
import { ApiError } from '../../models/api-error';
import { ResponseCodeEnum } from '../../models/enums/response-code.enum';

export const errorHandlerMiddleware: Middleware = async (
  ctx: Context,
  next: Next,
) => {
  try {
    await next();
    if (ctx.status === StatusCodes.NOT_FOUND) {
      ctx.status = StatusCodes.NOT_FOUND;
      throw new ApiError(StatusCodes.NOT_FOUND, ResponseCodeEnum.CM0001);
    }
  } catch (error) {
    if (error instanceof ApiError) {
      ctx.status = error._status;
      ctx.body = error.toErrorResponse();
      logger.error(error);
      return;
    }
    ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
    ctx.body = new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ResponseCodeEnum.CM0000,
    ).toErrorResponse();

    logger.error('Unhandled error: ', error, ctx);
  }
};
