import { ResponseBuilder } from '@core/utils/response-builder';
import Router from '@koa/router';
import { AppState } from '@models/app.state';
import { APIEnum } from '@models/enums/api.category.enum';
import { ParameterizedContext } from 'koa';
import { Context } from 'vm';
import Container from 'typedi';
import { CollectionService } from '@services/collection/collection.service';
import { GetUserInfo } from '@core/middleware/auth.middleware';
import { validateMiddleware } from '@core/middleware/validate.middleware';
import { CollectionSearchModel } from '@models/collection/collection-search';
import { CollectionDataModel } from '@models/collection/collection-data';
import { CollectionDetailModel } from '@models/collection/collection-detail';
import { plainToClass } from 'class-transformer';
import { UserInfo } from '@models/authorzization/user.info';
import { CollectionChartModel } from '@models/collection/collection-chart';

const CollectionRoute = new Router({
  prefix: '/collection',
});

// Get list user
CollectionRoute.get(
  APIEnum.GET_LIST_COLLECTION,
  GetUserInfo,
  validateMiddleware({
    query: CollectionSearchModel,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const collectionService =
      Container.get<CollectionService>(CollectionService);
    let user = ctx.state.user;
    user = user ? plainToClass(UserInfo, ctx.state.user) : null;
    const data = await collectionService.getListCollection(
      ctx.request.query,
      user,
    );
    ctx.body = new ResponseBuilder(data).build();
  },
);

CollectionRoute.get(
  APIEnum.DETAIL_COLLECTION,
  GetUserInfo,
  validateMiddleware({
    query: CollectionDetailModel,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const collectionService =
      Container.get<CollectionService>(CollectionService);
    let user = ctx.state.user;
    user = user ? plainToClass(UserInfo, ctx.state.user) : null;
    const data = await collectionService.getDetailCollection(
      ctx.request.query,
      user,
    );
    ctx.body = new ResponseBuilder(data).build();
  },
);

CollectionRoute.post(
  APIEnum.ADMIN_CREATE_COLLECTION,
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const collectionService =
      Container.get<CollectionService>(CollectionService);
    const data = await collectionService.adminCreateCollection(
      ctx.request.body,
    );
    ctx.body = new ResponseBuilder(data).build();
  },
);

CollectionRoute.post(
  APIEnum.ADMIN_UPDATE_COLLECTION,
  validateMiddleware({
    body: CollectionDataModel,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const collectionService =
      Container.get<CollectionService>(CollectionService);
    const data = await collectionService.updateInfoCollection(ctx.request.body);
    ctx.body = new ResponseBuilder(data).build();
  },
);

CollectionRoute.get(
  APIEnum.CHART_COLLECTION,
  validateMiddleware({
    query: CollectionChartModel,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const collectionService =
      Container.get<CollectionService>(CollectionService);
    const data = await collectionService.getCollectionChart(ctx.request.query);
    ctx.body = new ResponseBuilder(data).build();
  },
);

// CollectionRoute.get(
//   '/update-onchain-type',
//   async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
//     const collectionService =
//       Container.get<CollectionService>(CollectionService);
//     const data = await collectionService.updateOnchainType();
//     ctx.body = new ResponseBuilder(data).build();
//   },
// );

export { CollectionRoute };
