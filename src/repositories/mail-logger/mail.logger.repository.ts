import MailLoggerModel from '@entities/mongo-entities/mail-logger/mail.logger.entity';
import { IMailLogger } from '@entities/mongo-entities/mail-logger/mail.logger.interface';
import { MailLoggerEnum } from '@models/enums/send-mail.status';
import { MailLoggerRequest } from '@models/mail-logger/mail-logger-request';

export class MailoggerRepository {
  /**
   * Find log
   */
  async getMailLog(mailLoggerRequest: MailLoggerRequest): Promise<IMailLogger> {
    return await MailLoggerModel.findOne({
      from: mailLoggerRequest.from,
      to: mailLoggerRequest.to,
      description: mailLoggerRequest.description,
    });
  }

  /**
   * Save log into database
   */
  async createmailLog(
    mailLoggerRequest: MailLoggerRequest,
  ): Promise<IMailLogger> {
    return await MailLoggerModel.create({
      from: mailLoggerRequest.from,
      to: mailLoggerRequest.to,
      description: mailLoggerRequest.description,
      errorMessage: mailLoggerRequest.errorMessage,
    });
  }

  /**
   * success log
   */
  async sendMailSuccess(mailLog: MailLoggerRequest): Promise<IMailLogger> {
    const update = { status: MailLoggerEnum.SUCCESS };
    return await MailLoggerModel.findOneAndUpdate(mailLog, update);
  }

  /**
   * fail log
   */
  async sendMailFail(mailLog: MailLoggerRequest): Promise<IMailLogger> {
    const update = {
      status: MailLoggerEnum.FAILED,
      errorMessage: mailLog.errorMessage,
    };
    return await MailLoggerModel.findOneAndUpdate(mailLog, update);
  }
}
