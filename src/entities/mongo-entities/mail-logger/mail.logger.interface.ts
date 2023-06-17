import { MailLoggerEnum } from '@models/enums/send-mail.status';
export interface IMailLogger {
  id: string;
  from: string;
  to: string;
  description: string;
  errorMessage: string;
  status: MailLoggerEnum;
}
