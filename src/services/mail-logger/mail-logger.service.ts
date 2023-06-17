import 'reflect-metadata';
import { logger } from '@core/logger';
import { IMailLogger } from '@entities/mongo-entities/mail-logger/mail.logger.interface';
import { MailoggerRepository } from '@repositories/mail-logger/mail.logger.repository';
import { MailLoggerRequest } from '@models/mail-logger/mail-logger-request';
import { Service } from 'typedi';

@Service()
export class MailLoggerService {
  private readonly mailLoggerRepository: MailoggerRepository;

  constructor() {
    this.mailLoggerRepository = new MailoggerRepository();
  }

  /**
   * Add an mail log status
   */
  async addMailLog(model: MailLoggerRequest): Promise<boolean> {
    const mailLog = await this.mailLoggerRepository.getMailLog(model);

    if (mailLog) {
      logger.info(`This mail: ${model} is already log`);
      return false;
    }

    await this.mailLoggerRepository.createmailLog(model);
    return true;
  }

  /**
   * send mail success
   */
  async successLog(model: MailLoggerRequest): Promise<IMailLogger> {
    const mailLog = await this.mailLoggerRepository.getMailLog(model);

    if (!mailLog) throw Error('No mail log found');

    return await this.mailLoggerRepository.sendMailSuccess(model);
  }

  /**
   * send mail fail
   */
  async failLog(model: MailLoggerRequest): Promise<IMailLogger> {
    const mailLog = await this.mailLoggerRepository.getMailLog(model);

    if (!mailLog) throw Error('No mail log found');

    return await this.mailLoggerRepository.sendMailFail(model);
  }
}
