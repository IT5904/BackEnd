import { plainToClass } from 'class-transformer';
import { StatusCodes } from 'http-status-codes';
import { Context, ParameterizedContext } from 'koa';
import { VerifyUtils } from '@core/utils/verify';
import { logger } from '../logger';
import { ApiError } from '@models/api-error';
import { AppState } from '@models/app.state';
import { UserInfo } from '@models/authorzization/user.info';
import { ResponseCodeEnum } from '@models/enums/response-code.enum';
// import { UserTypeEnum } from '@models/enums/user.status';

export const UserRequired = async (
  ctx: ParameterizedContext<AppState, Context>,
  next,
) => {
  if (!ctx.headers['authorization']) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, ResponseCodeEnum.CM0004);
  }

  try {
    const token = ctx.headers['authorization'].split(' ')[1];
    const user = ((await VerifyUtils.verifyToken(token)) as any).payloads;
    const userInfo = plainToClass(UserInfo, user);

    // user require: ...
    // if (userInfo.userType != UserTypeEnum.NORMAL) {
    //   logger.error('User not active yet', userInfo);
    //   throw new ApiError(StatusCodes.FORBIDDEN, ResponseCodeEnum.CM0002);
    // }

    ctx.state.user = userInfo;
    ctx.state.token = token;
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    }

    logger.error('VERIFY TOKEN ERROR', e);
    throw new ApiError(StatusCodes.UNAUTHORIZED, ResponseCodeEnum.CM0004);
  }
  await next();
};

export const UserRequiredOrExpired = async (
  ctx: ParameterizedContext<AppState, Context>,
  next,
) => {
  if (!ctx.headers['authorization']) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, ResponseCodeEnum.CM0004);
  }

  try {
    const token = ctx.headers['authorization'].split(' ')[1];
    const user = ((await VerifyUtils.verifyToken(token, true)) as any).payloads;
    const userInfo = plainToClass(UserInfo, user);

    // user require: ...
    // if (userInfo.userType != UserTypeEnum.NORMAL) {
    //   logger.error('User not active yet', userInfo);
    //   throw new ApiError(StatusCodes.FORBIDDEN, ResponseCodeEnum.CM0002);
    // }

    ctx.state.user = userInfo;
    ctx.state.token = token;
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    }

    logger.error('VERIFY TOKEN ERROR', e);
    throw new ApiError(StatusCodes.UNAUTHORIZED, ResponseCodeEnum.CM0004);
  }
  await next();
};

export const UserRequiredOrGuest = async (
  ctx: ParameterizedContext<AppState, Context>,
  next,
) => {
  if (!ctx.headers['authorization']) {
    await next();
  } else {
    try {
      const token = ctx.headers['authorization'].split(' ')[1];
      const user = ((await VerifyUtils.verifyToken(token)) as any).payloads;
      const userInfo = plainToClass(UserInfo, user);

      // user require: ...
      // if (userInfo.userType != UserTypeEnum.NORMAL) {
      //   logger.error('User not active yet', userInfo);
      //   throw new ApiError(StatusCodes.FORBIDDEN, ResponseCodeEnum.CM0002);
      // }

      ctx.state.user = userInfo;
      ctx.state.token = token;
    } catch (e) {
      if (e instanceof ApiError) {
        throw e;
      }

      logger.error('VERIFY TOKEN ERROR', e.message);
      throw new ApiError(StatusCodes.UNAUTHORIZED, ResponseCodeEnum.CM0004);
    }
    await next();
  }
};

export const GetUserInfo = async (
  ctx: ParameterizedContext<AppState, Context>,
  next,
) => {
  if (!ctx.headers['authorization']) {
    await next();
  } else {
    try {
      const token = ctx.headers['authorization'].split(' ')[1];
      if (token) {
        const user = ((await VerifyUtils.verifyToken(token)) as any).payloads;
        const userInfo = plainToClass(UserInfo, user);

        // user require: ...
        // if (userInfo.userType != UserTypeEnum.NORMAL) {
        //   logger.error('User not active yet', userInfo);
        //   throw new ApiError(StatusCodes.FORBIDDEN, ResponseCodeEnum.CM0002);
        // }

        ctx.state.user = userInfo;
        ctx.state.token = token;
      } else {
        ctx.state.user = null;
        ctx.state.token = null;
      }
    } catch (e) {
      ctx.state.user = null;
      ctx.state.token = null;
    }
    await next();
  }
};
