import { InoService } from '@services/ino/ino.service';
import { validateMiddleware } from '@core/middleware/validate.middleware';
import { ResponseBuilder } from '@core/utils/response-builder';
import Router from '@koa/router';
import { AppState } from '@models/app.state';
import { APIEnum } from '@models/enums/api.category.enum';
import { UserTestSearchRequest } from '@models/user/user-test-search-request';
import { UserCreateRequest } from '@models/user/user-create.request';
import { LoginRequest } from '@models/auth/login.request';
import { UserService } from '@services/user/user.service';
import { ParameterizedContext } from 'koa';
import Container from 'typedi';
import { Context } from 'vm';
import { plainToClass } from 'class-transformer';
import { SendMailQueue } from '@core/jobs/send.mail.job';
import { MailLoggerService } from '@services/mail-logger/mail-logger.service';
import { config } from '@config/app';
import { AuthenticationService } from '@services/authentication/authentication.service';
import {
  GetUserInfo,
  UserRequired,
  UserRequiredOrExpired,
} from '@core/middleware/auth.middleware';
import { RefreshTokenRequest } from '@models/auth/refresh-token.request';
import { LogoutRequest } from '@models/auth/logout.request';
import { WAITING_LIST_MAIL } from '@core/const';
import { UserPostgresCreateRequest } from '@models/user/user-postgres-create.request';
import { UserInfo } from '@models/authorzization/user.info';
import { ApiError } from '@models/api-error';
import { StatusCodes } from 'http-status-codes';
import { ResponseCodeEnum } from '@models/enums/response-code.enum';
import { OperationTypeEnum } from '@models/enums/operation-type.enum';
import { NewUserWalletModel } from '@models/user/new-user-wallet';
import { WatchlistUpdateModel } from '@models/watchlist/watchlist-update';
import { WatchlistSearchModel } from '@models/watchlist/watchlist-search';
import { NftService } from '@services/nft/nft.service';
import IP from 'ip';
import { NftGetOfferModel, NftGetUserNFTModel } from '@models/nft/nft-search';
import { UpdateUserInfoModel } from '@models/user/update-user';
import { UserNoticeSearchModel } from '@models/user/user-notice.response';
import axios from 'axios';
import { request } from 'undici';
import { getRepository } from 'typeorm';
import {
  TocenUserDiscordEntity,
  TocenUserTwitterEntity,
} from '@entities/postgres-entities';
import { AuthDiscordRequest } from '@models/auth/auth-discord.request';

const UserRoute = new Router({
  prefix: '/user',
});
// Get user watchlist
UserRoute.get(
  APIEnum.USER_WATCHLIST,
  GetUserInfo,
  validateMiddleware({
    query: WatchlistSearchModel,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const userService = Container.get<UserService>(UserService);
    let user = ctx.state.user;
    user = user ? plainToClass(UserInfo, ctx.state.user) : null;
    const data = await userService.getUserWatchlist(ctx.request.query, user);
    ctx.body = new ResponseBuilder(data).withMeta(data.length).build();
  },
);

UserRoute.get(
  '/get-notice',
  validateMiddleware({
    query: UserNoticeSearchModel,
  }),
  GetUserInfo,
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const userService = Container.get<UserService>(UserService);
    let user = ctx.state.user;
    user = user ? plainToClass(UserInfo, ctx.state.user) : null;
    const model = plainToClass(UserNoticeSearchModel, ctx.request.query);
    const res = await userService.getUserNotice(model, user);
    ctx.body = new ResponseBuilder(res).build();
  },
);

UserRoute.get(
  '/get-new-notice',
  GetUserInfo,
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const userService = Container.get<UserService>(UserService);
    let user = ctx.state.user;
    user = user ? plainToClass(UserInfo, ctx.state.user) : null;
    const res = await userService.getNewNotice(user);
    ctx.body = new ResponseBuilder(res).build();
  },
);

UserRoute.post(
  '/delete-notice/:noticeId',
  GetUserInfo,
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const userService = Container.get<UserService>(UserService);
    let user = ctx.state.user;
    user = user ? plainToClass(UserInfo, ctx.state.user) : null;
    const res = await userService.deleteUserNotice(ctx.params.noticeId, user);
    ctx.body = new ResponseBuilder(res).build();
  },
);

UserRoute.post(
  '/read-notice/:noticeId',
  GetUserInfo,
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const userService = Container.get<UserService>(UserService);
    let user = ctx.state.user;
    user = user ? plainToClass(UserInfo, ctx.state.user) : null;
    const res = await userService.readUserNotice(ctx.params.noticeId, user);
    ctx.body = new ResponseBuilder(res).build();
  },
);

UserRoute.post(
  '/clear-all-notice',
  GetUserInfo,
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const userService = Container.get<UserService>(UserService);
    let user = ctx.state.user;
    user = user ? plainToClass(UserInfo, ctx.state.user) : null;
    const res = await userService.clearAllNotice(user);
    ctx.body = new ResponseBuilder(res).build();
  },
);

UserRoute.post(
  '/read-all-notice',
  GetUserInfo,
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const userService = Container.get<UserService>(UserService);
    let user = ctx.state.user;
    user = user ? plainToClass(UserInfo, ctx.state.user) : null;
    const res = await userService.readAllNotice(user);
    ctx.body = new ResponseBuilder(res).build();
  },
);

UserRoute.get(
  '/migrate-notice',
  GetUserInfo,
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const userService = Container.get<UserService>(UserService);
    let user = ctx.state.user;
    user = user ? plainToClass(UserInfo, ctx.state.user) : null;
    const res = await userService.migrateNotice(user);
    ctx.body = new ResponseBuilder(res).build();
  },
);

// Get list user
UserRoute.get(
  APIEnum.USER_LIST,
  UserRequired,
  validateMiddleware({
    query: UserTestSearchRequest,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const userService = Container.get<UserService>(UserService);
    const data = await userService.getListUser();
    ctx.body = new ResponseBuilder(data).withMeta(data.length).build();
  },
);

// Add user to waiting list
UserRoute.post(
  APIEnum.ADD_WAITING_USER,
  validateMiddleware({
    body: UserCreateRequest,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const userService = Container.get<UserService>(UserService);
    const mailLoggerService =
      Container.get<MailLoggerService>(MailLoggerService);
    const bodyModel = plainToClass(UserCreateRequest, ctx.request.body);
    const data = await userService.addToWaitingList(bodyModel);

    const jobOptions = {
      jobId: data.id,
      attempts: 3,
      removeOnComplete: 3600,
      removeOnFail: 72 * 3600,
    };

    const existedJob = await SendMailQueue.getJob(data.id);

    if (!existedJob) {
      const log = await mailLoggerService.addMailLog({
        from: config.email.sender,
        to: data.email,
        description: WAITING_LIST_MAIL,
        errorMessage: '',
      });
      if (log) SendMailQueue.add(data, jobOptions);
    }

    ctx.body = new ResponseBuilder(data).build();
  },
);

// Regist
UserRoute.post(
  APIEnum.REGIST,
  validateMiddleware({
    body: UserPostgresCreateRequest,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const authenService = Container.get<AuthenticationService>(
      AuthenticationService,
    );

    const inoService = Container.get<InoService>(InoService);
    const model = plainToClass(UserPostgresCreateRequest, ctx.request.body);
    const token = await authenService.registOrEdit(model);
    await inoService.insertOrUpdateUserIno(model.address);
    ctx.body = new ResponseBuilder(token).build();
  },
);

// Edit profile
UserRoute.put(
  APIEnum.EDIT,
  UserRequired,
  validateMiddleware({
    body: UserPostgresCreateRequest,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const userService = Container.get<UserService>(UserService);
    const user = plainToClass(UserInfo, ctx.state.user);
    const model = plainToClass(UserPostgresCreateRequest, ctx.request.body);

    if (model.operationTypeEnum !== OperationTypeEnum.REGISTER) {
      if (!model.id || user.id !== model.id)
        throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0002);
    }
    await userService.createUser(model, model.operationTypeEnum);
    ctx.body = new ResponseBuilder().success().build();
  },
);

// Regist new chain account
UserRoute.post(
  APIEnum.REGIST_NEW_CHAIN,
  UserRequired,
  validateMiddleware({
    body: NewUserWalletModel,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const userService = Container.get<UserService>(UserService);
    const user = plainToClass(UserInfo, ctx.state.user);
    const model = plainToClass(NewUserWalletModel, ctx.request.body);

    await userService.registNewChain(user.id, model);
    ctx.body = new ResponseBuilder().success().build();
  },
);

// Login
UserRoute.post(
  APIEnum.LOGIN,
  GetUserInfo,
  validateMiddleware({
    body: LoginRequest,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const authenService = Container.get<AuthenticationService>(
      AuthenticationService,
    );
    // const inoService = Container.get<InoService>(InoService);
    let user = ctx.state.user;
    user = user ? plainToClass(UserInfo, ctx.state.user) : null;

    const ipAddress =
      ctx.request.headers['cf-connecting-ip'] ||
      ctx.request.headers['x-real-ip'] ||
      ctx.request.headers['x-forwarded-for'] ||
      IP.address();

    const model = plainToClass(LoginRequest, ctx.request.body);
    const token = await authenService.login(model, ipAddress, user);
    // await inoService.insertOrUpdateUserIno(model.address);

    ctx.body = new ResponseBuilder(token).build();
  },
);

// Login by twitter
UserRoute.get(
  APIEnum.LOGIN_BY_TWITTER,
  validateMiddleware({
    query: AuthDiscordRequest,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const code = ctx.request.query.code;
    type TwitterTokenResponse = {
      token_type: 'bearer';
      expires_in: 7200;
      access_token: string;
      scope: string;
    };

    const TWITTER_OAUTH_TOKEN_URL = 'https://api.twitter.com/2/oauth2/token';
    const twitterOauthTokenParams = {
      client_id:
        process.env.TWITTER_CLIENT_ID || 'RklTalNhbUN4aHdiSXctbFpHQU06MTpjaQ',
      // based on code_challenge
      code_verifier: '8KxxO-RPl0bLSxX5AWwgdiFbMnry_VOKzFeIlVA7NoA',
      redirect_uri: `https://tocen.co/marketplace/oauthtw`,
      grant_type: 'authorization_code',
    };
    const BasicAuthToken = Buffer.from(
      `${
        process.env.TWITTER_CLIENT_ID || 'RklTalNhbUN4aHdiSXctbFpHQU06MTpjaQ'
      }:${
        process.env.TWITTER_CLIENT_SECRET ||
        'ObrggZVWfQ2gCXXYchJkFSlpFBmwcEzhAA0MTUGHfG5neg3d6S'
      }`,
      'utf8',
    ).toString('base64');

    const res = await axios.post<TwitterTokenResponse>(
      TWITTER_OAUTH_TOKEN_URL,
      new URLSearchParams({ ...twitterOauthTokenParams, code }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${BasicAuthToken}`,
        },
      },
    );

    const userTwitter = await axios.get<{ data: any }>(
      'https://api.twitter.com/2/users/me',
      {
        headers: {
          'Content-type': 'application/json',
          // put the access token in the Authorization Bearer token
          Authorization: `Bearer ${res.data.access_token}`,
        },
      },
    );

    const saveResult = await getRepository(TocenUserTwitterEntity)
      .createQueryBuilder()
      .update(TocenUserTwitterEntity)
      .set({
        twitterId: userTwitter?.data?.data?.id,
        accessToken: res.data.access_token,
        name: userTwitter?.data?.data?.name,
        username: userTwitter?.data?.data?.username,
      })
      .where('username = :username', {
        username: userTwitter?.data?.data?.username,
      })
      .execute();

    ctx.body = new ResponseBuilder(saveResult).build();
  },
);

// Login by discord
UserRoute.get(
  APIEnum.LOGIN_BY_DISCORD,
  validateMiddleware({
    query: AuthDiscordRequest,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    try {
      const code = ctx.request.query.code;

      const tokenResponseData = await request(
        'https://discord.com/api/oauth2/token',
        {
          method: 'POST',
          body: new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID || '1101414320446918726',
            client_secret:
              process.env.DISCORD_CLIENT_SECRET ||
              'qVG4ZEFMywzVBuaPZtqRcq9WXVvw1jJ3',
            code,
            grant_type: 'authorization_code',
            redirect_uri:
              process.env.MARKET_PRODUCT_URL ||
              'https://tocen.co/marketplace/oauthdc',
            scope: 'identify',
          }).toString(),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const oauthData = await tokenResponseData.body.json();

      const userResult = await request('https://discord.com/api/users/@me', {
        headers: {
          authorization: `${oauthData?.token_type} ${oauthData?.access_token}`,
        },
      });
      oauthData.userData = await userResult.body.json();
      console.log(111, oauthData);

      if (oauthData?.userData?.id) {
        const saveResult = await getRepository(TocenUserDiscordEntity)
          .createQueryBuilder()
          .update(TocenUserDiscordEntity)
          .set({
            accessToken: oauthData?.access_token,
            refreshToken: oauthData?.refresh_token,
          })
          .where('discord_id = :id', { id: oauthData?.userData?.id })
          .execute();

        ctx.body = new ResponseBuilder(saveResult).build();
      }
    } catch (error) {
      // NOTE: An unauthorized token will not throw an error
      // tokenResponseData.statusCode will be 401
      console.error(error);
    }
  },
);

// Logout
UserRoute.post(
  APIEnum.LOGOUT,
  validateMiddleware({
    body: LogoutRequest,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const authenService = Container.get<AuthenticationService>(
      AuthenticationService,
    );
    const model = plainToClass(LogoutRequest, ctx.request.body);
    await authenService.logout(model.refreshToken);
    ctx.body = new ResponseBuilder().build();
  },
);

// refresh token
UserRoute.post(
  APIEnum.REFRESH_TOKEN,
  UserRequiredOrExpired,
  validateMiddleware({
    body: RefreshTokenRequest,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const authenService = Container.get<AuthenticationService>(
      AuthenticationService,
    );
    const model = plainToClass(RefreshTokenRequest, ctx.request.body);
    const token = await authenService.reFreshToken(
      model.refreshToken,
      ctx.state.user,
    );
    ctx.body = new ResponseBuilder(token).build();
  },
);

UserRoute.post(
  APIEnum.ADD_AND_REMOVE_WATCHLIST,
  GetUserInfo,
  validateMiddleware({
    body: WatchlistUpdateModel,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const userService = Container.get<UserService>(UserService);
    let user = ctx.state.user;
    user = user ? plainToClass(UserInfo, ctx.state.user) : null;
    const data = await userService.addAndRemoveUserWatchlist(
      ctx.request.body,
      user,
    );
    ctx.body = new ResponseBuilder(data).build();
  },
);

// Get user profile
UserRoute.get(
  '/profile/:address',
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const userService = Container.get<UserService>(UserService);

    const user = await userService.getUserProfile(ctx.params.address);
    ctx.body = new ResponseBuilder(user).build();
  },
);

// Update user profile
UserRoute.post(
  '/profile/:address/update',
  validateMiddleware({
    body: UpdateUserInfoModel,
  }),
  GetUserInfo,
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const userService = Container.get<UserService>(UserService);
    let user = ctx.state.user;
    user = user ? plainToClass(UserInfo, ctx.state.user) : null;
    const data = await userService.updateUserProfile(
      user.walletAddress,
      ctx.request.body,
    );
    ctx.body = new ResponseBuilder(data).build();
  },
);

// Get user NFT
UserRoute.get(
  '/nft/:address',
  validateMiddleware({
    query: NftGetUserNFTModel,
  }),
  GetUserInfo,
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const nftService = Container.get<NftService>(NftService);
    let user = ctx.state.user;
    user = user ? plainToClass(UserInfo, ctx.state.user) : null;
    const res = await nftService.getUserNft(
      ctx.request.query,
      user,
      ctx.params.address,
    );
    ctx.body = new ResponseBuilder(res).build();
  },
);

UserRoute.get(
  '/nft-offer/:address',
  validateMiddleware({
    query: NftGetOfferModel,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const nftService = Container.get<NftService>(NftService);

    const user = await nftService.getUserOfferNft(
      ctx.request.query,
      ctx.params.address,
    );
    ctx.body = new ResponseBuilder(user).build();
  },
);

UserRoute.get(
  '/nft-collection-offer/:address',
  validateMiddleware({
    query: NftGetOfferModel,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const nftService = Container.get<NftService>(NftService);

    const user = await nftService.getUserCollectionOfferNft(
      ctx.request.query,
      ctx.params.address,
    );
    ctx.body = new ResponseBuilder(user).build();
  },
);

UserRoute.get(
  '/nft-offer-received/:address',
  validateMiddleware({
    query: NftGetOfferModel,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const nftService = Container.get<NftService>(NftService);

    const user = await nftService.getUserOfferReceivedNft(
      ctx.request.query,
      ctx.params.address,
    );
    ctx.body = new ResponseBuilder(user).build();
  },
);

// Get user info
UserRoute.get(
  '/:id',
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const userService = Container.get<UserService>(UserService);

    const user = await userService.getUserInfo(Number(ctx.params.id));
    ctx.body = new ResponseBuilder(user).build();
  },
);

export { UserRoute };
