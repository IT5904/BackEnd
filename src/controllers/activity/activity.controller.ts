import { validateMiddleware } from '@core/middleware/validate.middleware';
import { ResponseBuilder } from '@core/utils/response-builder';
import Router from '@koa/router';
import { ActivitySearchRequest } from '@models/activity/activity-search.request';
import { AppState } from '@models/app.state';
import { APIEnum } from '@models/enums/api.category.enum';
import { ActivityService } from '@services/activity/activity.service';
import { plainToClass } from 'class-transformer';
import { ParameterizedContext } from 'koa';
import Container from 'typedi';
import { Context } from 'vm';

const ActivityRoute = new Router();

// Get list
ActivityRoute.post(
  APIEnum.ACTIVITY,
  validateMiddleware({
    body: ActivitySearchRequest,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const activityService = Container.get<ActivityService>(ActivityService);
    const model = plainToClass(ActivitySearchRequest, ctx.request.body);
    const result = await activityService.getListActivity(model);
    ctx.body = new ResponseBuilder(result).build();
  },
);

export { ActivityRoute };
