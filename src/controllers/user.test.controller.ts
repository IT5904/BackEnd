// import { validateMiddleware } from '@core/middleware/validate.middleware';
import { validateMiddleware } from '@core/middleware/validate.middleware';
import { ResponseBuilder } from '@core/utils/response-builder';
import Router from '@koa/router';
import { AppState } from '@models/app.state';
import { APIEnum } from '@models/enums/api.category.enum';
import { UserTestSearchRequest } from '@models/user/user-test-search-request';
import { UserService } from '@services/user/user.service';
import { ParameterizedContext } from 'koa';
import Container from 'typedi';
import { Context } from 'vm';

const UserTestRoute = new Router();

// Get list user test
UserTestRoute.get(
  APIEnum.USER_TEST_LIST,
  validateMiddleware({
    query: UserTestSearchRequest,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const userService = Container.get<UserService>(UserService);
    const res = await userService.getListUser();
    ctx.body = new ResponseBuilder(res).withMeta(res.length).build();
  },
);

export { UserTestRoute };
