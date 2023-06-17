import { Database } from '@core/database';
import { logger } from '@core/logger';
import 'reflect-metadata';
import { argv } from 'process';

console.log('!!!!!!!!!!!!!!!!!!!!!!!!!', process.env.DATABASE_URL);

export const handler = async (event: string): Promise<string> => {
  logger.info('Migration:', event);

  switch (event) {
    case 'up':
      await (await Database.getPostgresConnection()).runMigrations();
      break;
    case 'down':
      await (await Database.getPostgresConnection()).undoLastMigration();
      break;
    default:
      throw new Error('Unknown event');
  }

  return 'Done';
};

// @typescript-eslint/no-floating-promises
handler(argv[2]);
