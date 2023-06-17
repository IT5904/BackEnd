import { ResponseBuilder } from '@core/utils/response-builder';
import Router from '@koa/router';
import { AppState } from '@models/app.state';
import { APIEnum } from '@models/enums/api.category.enum';
import { ParameterizedContext } from 'koa';
import { Context } from 'vm';
import Container from 'typedi';
import { NftService } from '@services/nft/nft.service';
import {
  UserRequired,
  UserRequiredOrGuest,
  GetUserInfo,
} from '@core/middleware/auth.middleware';
import { validateMiddleware } from '@core/middleware/validate.middleware';
import {
  NftSearchModel,
  NftGetMoreModel,
  NftGetOfferModel,
  NftExploreModel,
  NftCartModel,
  NftFavoriteSearchModel,
} from '@models/nft/nft-search';
import { NftDataModel } from '@models/nft/nft-data';
import { plainToClass } from 'class-transformer';
import { UserInfo } from '@models/authorzization/user.info';
const NftRoute = new Router({
  prefix: '/nft',
});

// Get list nft
NftRoute.get(
  APIEnum.GET_LIST_NFT,
  validateMiddleware({
    query: NftSearchModel,
  }),
  GetUserInfo,
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const nftService = Container.get<NftService>(NftService);
    const model = plainToClass(NftSearchModel, ctx.request.query);
    let user = ctx.state.user;
    user = user ? plainToClass(UserInfo, ctx.state.user) : null;
    const data = await nftService.getListNft(model, user);
    ctx.body = new ResponseBuilder(data).build();
  },
);

// Get list user
NftRoute.get(
  APIEnum.GET_LIST_NFT + '/favorite',
  UserRequired,
  validateMiddleware({
    query: NftFavoriteSearchModel,
  }),
  GetUserInfo,
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const nftService = Container.get<NftService>(NftService);
    const model = plainToClass(NftSearchModel, ctx.request.query);
    const user = plainToClass(UserInfo, ctx.state.user);
    const data = await nftService.getListFavoriteNft(model, user);
    ctx.body = new ResponseBuilder(data).build();
  },
);

NftRoute.get(
  '/explore',
  validateMiddleware({
    query: NftExploreModel,
  }),
  GetUserInfo,
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const nftService = Container.get<NftService>(NftService);
    const model = plainToClass(NftExploreModel, ctx.request.query);
    let user = ctx.state.user;
    user = user ? plainToClass(UserInfo, ctx.state.user) : null;
    const data = await nftService.getNftExplore(model, user);
    ctx.body = new ResponseBuilder(data).build();
  },
);

NftRoute.get(
  APIEnum.GET_LIST_MORE_NFT + '/:address',
  validateMiddleware({
    query: NftGetMoreModel,
  }),
  GetUserInfo,
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const nftService = Container.get<NftService>(NftService);
    let user = ctx.state.user;
    user = user ? plainToClass(UserInfo, ctx.state.user) : null;
    const data = await nftService.getMoreNft(
      {
        ...ctx.request.query,
        address: ctx.params.address,
      },
      user,
    );
    ctx.body = new ResponseBuilder(data).build();
  },
);

NftRoute.get(
  '/portfolio-nft',
  GetUserInfo,
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const nftService = Container.get<NftService>(NftService);
    let user = ctx.state.user;
    user = user ? plainToClass(UserInfo, ctx.state.user) : null;
    const data = await nftService.getPortfolioNFT(user);
    ctx.body = new ResponseBuilder(data).build();
  },
);

// Get detail NFT
NftRoute.get(
  '/:address',
  GetUserInfo,
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const nftService = Container.get<NftService>(NftService);
    let user = ctx.state.user;
    user = user ? plainToClass(UserInfo, ctx.state.user) : null;
    const nft = await nftService.getNftDetail(ctx.params.address, user);
    ctx.body = new ResponseBuilder(nft).build();
  },
);

NftRoute.get(
  '/refresh-owner/:address',
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const nftService = Container.get<NftService>(NftService);
    const nft = await nftService.refreshOwnerNFT(ctx.params.address);
    ctx.body = new ResponseBuilder(nft).build();
  },
);

NftRoute.post(
  '/like',
  UserRequiredOrGuest,
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const nftService = Container.get<NftService>(NftService);
    const user = plainToClass(UserInfo, ctx.state.user);
    const data = await nftService.likeNft(ctx.request.body, user);
    ctx.body = new ResponseBuilder(data).build();
  },
);

NftRoute.post(
  APIEnum.UPDATE_COLLECTION,
  UserRequired,
  validateMiddleware({
    body: NftDataModel,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const nftService = Container.get<NftService>(NftService);
    const model = plainToClass(NftDataModel, ctx.request.body);
    const user = plainToClass(UserInfo, ctx.state.user);
    const data = await nftService.createNft(model, user);
    ctx.body = new ResponseBuilder(data).build();
  },
);

NftRoute.get(
  APIEnum.GET_OFFER_NFT + '/:nftAddress',
  validateMiddleware({
    query: NftGetOfferModel,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const nftService = Container.get<NftService>(NftService);
    const model = plainToClass(NftGetOfferModel, ctx.request.query);
    const data = await nftService.getOfferNft({
      ...model,
      nftAddress: ctx.params.nftAddress,
    });
    ctx.body = new ResponseBuilder(data).build();
  },
);

NftRoute.get(
  APIEnum.GET_COLLECTION_OFFER_NFT + '/:collectionAddress',
  validateMiddleware({
    query: NftGetOfferModel,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const nftService = Container.get<NftService>(NftService);
    const model = plainToClass(NftGetOfferModel, ctx.request.query);
    const data = await nftService.getCollectionOfferNft({
      ...model,
      collectionAddress: ctx.params.collectionAddress,
    });
    ctx.body = new ResponseBuilder(data).build();
  },
);

NftRoute.post(
  '/detail-cart',
  validateMiddleware({
    body: NftCartModel,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const nftService = Container.get<NftService>(NftService);
    const model = plainToClass(NftCartModel, ctx.request.body);
    const data = await nftService.getCartNft(model);
    ctx.body = new ResponseBuilder(data).build();
  },
);

export { NftRoute };
