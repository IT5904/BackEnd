import Queue, { Job } from 'bull';
import { logger } from '@core/logger';
import { config } from '@config/app';
import { MailerService } from '@services/mailer/mailer.service';
import Container from 'typedi';
import { IUser } from '@entities/mongo-entities/user/user.interface';

const SendMailQueue = new Queue('SendMailQueue', {
  redis: {
    host: config.redis_url,
    port: +config.redis_port,
    password: config.redis_password,
  },
});

SendMailQueue.process(async (job: Job) => {
  try {
    logger.info('------Processing send mail, Job-Id:------------', job.id);
    const mailerService = Container.get<MailerService>(MailerService);

    const data = job.data as IUser;
    await mailerService.sendMail(data.email);
  } catch (e) {
    logger.info('ERROR:', e);
    job.moveToFailed(new Error(`ERROR: ${JSON.parse(e)}`), false);
  }
});

export { SendMailQueue };
