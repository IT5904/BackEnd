import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Context } from 'koa';
import { ValidationRequestError } from '@models/validation-request.error';
import { logger } from '../logger';

export const validateMiddleware = (
  option: { body?: any; query?: any; params?: any } = {},
) => {
  return async (ctx: Context, next) => {
    if (option.body) {
      ctx.request.body = await processValidate(option.body, ctx.request.body);
    }
    if (option.query) {
      ctx.query = await processValidate(option.query, ctx.query);
    }
    if (option.params) {
      ctx.params = await processValidate(option.params, ctx.params);
    }
    await next();
  };
};

async function processValidate(clazz: any, object: any): Promise<any> {
  const transformed = plainToClass(clazz, object);
  const errors = await validate(transformed);
  if (errors.length > 0) {
    logger.error(errors);
    throw new ValidationRequestError(errors);
  }
  return transformed;
}
