/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import Koa, { Context } from 'koa';
import { AppState } from '@models/app.state';
import Router from '@koa/router';
import { config } from '@config/app';
import { loggerMiddleware } from '@core/middleware/logger.middleware';
import { errorHandlerMiddleware } from '@core/middleware/error-handler.middleware';
import { UserTestRoute } from '@controllers/user.test.controller';
import { UserRoute } from '@controllers/user/user.controller';
import { ActivityRoute } from '@controllers/activity/activity.controller';
import { HealthRoute } from '@controllers/health/health.controller';
import { CollectionRoute } from '@controllers/collection/collection.controller';
import { NftRoute } from '@controllers/nft/nft.controller';
import { ElasticsearchRoute } from '@controllers/elasticsearch/elasticsearch.controller';
import { useContainer } from 'typeorm';
import Container from 'typedi';
import { InoRoute } from '@controllers/ino/ino.controller';
// import { VerifyRoute } from '@controllers/verify/verify.controller';

useContainer(Container);
const app = new Koa<AppState, Context>();

app.use(cors());
app.use(
  bodyParser({
    enableTypes: ['json'],
    jsonLimit: config.app.jsonLimit,
  }),
);
app.use(loggerMiddleware);
app.use(errorHandlerMiddleware);

const router = new Router();

const webRoutes = [
  UserTestRoute,
  UserRoute,
  CollectionRoute,
  NftRoute,
  InoRoute,
  ActivityRoute,
  HealthRoute,
  ElasticsearchRoute,
  // VerifyRoute,
];
router.use(HealthRoute.routes());

router.use(`${config.app.api_prefix}/web`, ...webRoutes.map((e) => e.routes()));

app.use(router.routes()).use(router.allowedMethods());
if (process.env.NODE_ENV != 'development') {
  console.info = function () {};
  console.warn = function () {};
  console.log = function () {};
}
export default app;
