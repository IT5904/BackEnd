import { ResponseBuilder } from '@core/utils/response-builder';
import { ChainUrlEntity } from '@entities/postgres-entities';
import Router from '@koa/router';
import { AppState } from '@models/app.state';
import { APIEnum } from '@models/enums/api.category.enum';
import { ParameterizedContext } from 'koa';
import { getRepository } from 'typeorm';
import { Context } from 'vm';

const HealthRoute = new Router();

// Get list user
HealthRoute.get(
  APIEnum.HEALTH_API,
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const data = 'OK';
    ctx.body = new ResponseBuilder(data).build();
  },
);

HealthRoute.get(
  APIEnum.GET_CHAIN_URL,
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    let data = await getRepository(ChainUrlEntity)
      .createQueryBuilder('cu')
      .select(
        `
        cu.chain_url
        `,
      )
      .where(`cu.client_status=0 AND cu.chain_url != :privateUrl`, {
        privateUrl: 'http://192.168.8.122:9000/',
      })
      .getRawMany();
    data = data.map((x) => x.chain_url);
    ctx.body = new ResponseBuilder(data).build();
  },
);

export { HealthRoute };
