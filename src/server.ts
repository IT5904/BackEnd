import 'reflect-metadata';
import { logger } from '@core/logger';
import { config } from '@config/app';
import app from './app';
import { Database } from '@core/database';
import RedisClient from '../src/config/redis';

const port = config.port;

// console.log(process.env.DATABASE_URL);

const startServer = async (): Promise<void> => {
  await Database.getConnection();
  await Database.getPostgresConnection();
  app
    .listen(port, () => {
      RedisClient.connect();
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    })
    .on('error', (err) => {
      logger.error(err);
    });
};

startServer();
