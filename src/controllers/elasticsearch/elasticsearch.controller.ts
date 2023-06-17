import { ResponseBuilder } from '@core/utils/response-builder';
import Router from '@koa/router';
import { AppState } from '@models/app.state';
import { ParameterizedContext } from 'koa';
import { Context } from 'vm';
import Container from 'typedi';
import { ElasticsearchService } from '@services/elasticsearch/elasticsearch.service';

const ElasticsearchRoute = new Router({
  prefix: '/elasticsearch',
});

ElasticsearchRoute.get(
  '/migrate-data',
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const elasticsearchService =
      Container.get<ElasticsearchService>(ElasticsearchService);
    const data = await elasticsearchService.migrateCollection();
    ctx.body = new ResponseBuilder(data).build();
  },
);

ElasticsearchRoute.get(
  '/delete-data',
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const elasticsearchService =
      Container.get<ElasticsearchService>(ElasticsearchService);
    const data = await elasticsearchService.deleteCollection();
    ctx.body = new ResponseBuilder(data).build();
  },
);

ElasticsearchRoute.get(
  '/search',
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const elasticsearchService =
      Container.get<ElasticsearchService>(ElasticsearchService);
    const { filter } = ctx.request.query;
    const data = await elasticsearchService.search(filter);
    ctx.body = new ResponseBuilder(data).build();
  },
);

export { ElasticsearchRoute };
