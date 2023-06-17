import Container, { Service } from 'typedi';
import { logger } from '@core/logger';
import { config } from '@config/app';
import { Transporter, createTransport } from 'nodemailer';
import { MailLoggerService } from '@services/mail-logger/mail-logger.service';
import { MailLoggerRequest } from '@models/mail-logger/mail-logger-request';
import * as fs from 'fs';
import { compile } from 'handlebars';
import { WAITING_LIST_MAIL } from '@core/const';
import path from 'path';
@Service()
export class MailerService {
  async sendMail(to: string): Promise<boolean> {
    const mailLoggerService =
      Container.get<MailLoggerService>(MailLoggerService);
    const transporter: Transporter = createTransport({
      host: config.email.host,
      port: +config.email.port,
      secure: false,
      auth: {
        user: config.email.username,
        pass: config.email.password,
      },
    });

    const htmlFile = fs.readFileSync(
      path.join(__dirname, '../../public/waitingmail.html'),
      {
        encoding: 'utf-8',
      },
    );
    const logoPath = path.join(__dirname, '../../public/volcaniX-logo2d.png');
    if (!htmlFile) logger.error(`HTML template not found`);

    const template = compile(htmlFile);
    const replacements = {
      usermail: to,
      logopath: logoPath,
    };
    const htmlToSend = template(replacements);
    const msg = {
      from: config.email.sender,
      to: to,
      subject: 'Volkanix keeps on growing',
      text: 'Sending with SES!',
      html: htmlToSend,
    };

    const mailLog: MailLoggerRequest = {
      from: config.email.sender,
      to: to,
      description: WAITING_LIST_MAIL,
      errorMessage: '',
    };

    transporter
      .sendMail(msg)
      .then(() => {
        logger.info(`An email has been send to ${to}`);
        mailLoggerService.successLog(mailLog);
      })
      .catch((error) => {
        logger.error(`SES: ${JSON.stringify(error)}`);
        mailLog.errorMessage = JSON.stringify(error);
        mailLoggerService.failLog(mailLog);
        return false;
      });

    return true;
  }
}
