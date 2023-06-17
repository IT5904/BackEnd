import { CalcWhitelist } from './../../models/ino/calc-whitelist';
import { MintNftInoModel } from './../../models/ino/mint-nft';
import { ResponseBuilder } from '@core/utils/response-builder';
import { validateMiddleware } from '@core/middleware/validate.middleware';
import Router from '@koa/router';
import { AppState } from '@models/app.state';
import { APIEnum } from '@models/enums/api.category.enum';
// import { UserInoModel } from '@models/ino/user-info';
import { ParameterizedContext } from 'koa';
import { Context } from 'vm';
import { UserRequired } from './../../core/middleware/auth.middleware';
import { InoService } from '@services/ino/ino.service';
import Container from 'typedi';
import { PoolInoModel } from '@models/ino/pool-info';
import { AddWhitelist } from '@models/ino/add-whitelist';
import { AddPrivate } from '@models/ino/add-private';
import { AddHolder } from '@models/ino/add-holder';
// import { VerifyDiscordModel } from '@models/ino/verify-discord';
const InoRoute = new Router({
  prefix: '/ino',
});

InoRoute.get(
  APIEnum.GET_USER_INO,
  UserRequired,

  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const inoService = Container.get<InoService>(InoService);

    const data = await inoService.getUserInfo(ctx.state.user.walletAddress);
    ctx.body = new ResponseBuilder(data).build();
  },
);

InoRoute.post(
  APIEnum.GET_POOL_INO,
  // UserRequired,
  validateMiddleware({
    body: PoolInoModel,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const inoService = Container.get<InoService>(InoService);
    // console.log(111, ctx.state.user);
    const data = await inoService.getPoolInfo(ctx.request.body.project);
    ctx.body = new ResponseBuilder(data).build();
  },
);

InoRoute.post(
  APIEnum.GET_RANK_INO,
  // UserRequired,
  validateMiddleware({
    body: PoolInoModel,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const inoService = Container.get<InoService>(InoService);
    // console.log(111, ctx.state.user);
    const data = await inoService.getRankInfo(
      ctx.request.body.project,
      ctx.request.body.page || 1,
      ctx.request.body.limit || 50,
    );
    const res = {
      data: data,
      hasNextPage: data.length === 0 ? false : true,
    };
    ctx.body = new ResponseBuilder(res).build();
  },
);

InoRoute.post(
  APIEnum.MINT_NFT_INO,
  UserRequired,
  validateMiddleware({
    body: MintNftInoModel,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const inoService = Container.get<InoService>(InoService);

    const data = await inoService.mintNftIno(
      ctx.request.body,
      ctx.state.user.walletAddress,
    );
    ctx.body = new ResponseBuilder(data).build();
  },
);

InoRoute.post(
  APIEnum.CALC_WHITELIST,
  // UserRequired,
  validateMiddleware({
    body: CalcWhitelist,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const inoService = Container.get<InoService>(InoService);

    const data = await inoService.calcWhitelist(ctx.request.body.project);
    ctx.body = new ResponseBuilder(data).build();
  },
);

InoRoute.post(
  APIEnum.ADD_WHITELIST,
  // UserRequired,
  validateMiddleware({
    body: AddWhitelist,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const inoService = Container.get<InoService>(InoService);

    const data = await inoService.addWhitelist(
      ctx.request.body.project,
      ctx.request.body.whitelist,
    );
    ctx.body = new ResponseBuilder(data).build();
  },
);

InoRoute.post(
  APIEnum.ADD_PRIVATE,
  // UserRequired,
  validateMiddleware({
    body: AddPrivate,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const inoService = Container.get<InoService>(InoService);

    const data = await inoService.addPrivate(
      ctx.request.body.project,
      ctx.request.body.private,
    );
    ctx.body = new ResponseBuilder(data).build();
  },
);

InoRoute.post(
  APIEnum.ADD_HOLDER,
  // UserRequired,
  validateMiddleware({
    body: AddHolder,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const inoService = Container.get<InoService>(InoService);

    const data = await inoService.addHolder(
      ctx.request.body.project,
      ctx.request.body.holder,
    );
    ctx.body = new ResponseBuilder(data).build();
  },
);

InoRoute.post(
  APIEnum.CALC_HOLDER,
  // UserRequired,
  validateMiddleware({
    body: CalcWhitelist,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const inoService = Container.get<InoService>(InoService);

    const data = await inoService.calcHolder(ctx.request.body.project);
    ctx.body = new ResponseBuilder(data).build();
  },
);

InoRoute.post(
  APIEnum.CALC_PRIVATE,
  // UserRequired,
  validateMiddleware({
    body: CalcWhitelist,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const inoService = Container.get<InoService>(InoService);

    const data = await inoService.calcPrivate(ctx.request.body.project);
    ctx.body = new ResponseBuilder(data).build();
  },
);

InoRoute.get(
  APIEnum.VERIFY_DISCORD,
  UserRequired,
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const inoService = Container.get<InoService>(InoService);
    const data = await inoService.verifyDiscord(ctx.state.user.walletAddress);
    ctx.body = new ResponseBuilder(data).build();
  },
);

InoRoute.get(
  APIEnum.VERIFY_TWITTER,
  UserRequired,
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const inoService = Container.get<InoService>(InoService);
    const data = await inoService.verifyTwitter(ctx.state.user.walletAddress);
    ctx.body = new ResponseBuilder(data).build();
  },
);

export { InoRoute };
