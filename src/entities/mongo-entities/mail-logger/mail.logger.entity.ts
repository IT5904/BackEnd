import mongoose from 'mongoose';
import { IMailLogger } from './mail.logger.interface';
import { MailLoggerEnum } from '@models/enums/send-mail.status';
const Schema = mongoose.Schema;

const MailLoggerSchema = new Schema(
  {
    from: {
      type: String,
      required: true,
      unique: false,
    },
    to: {
      type: String,
      unique: false,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    errorMessage: {
      type: String,
      require: false,
    },
    status: {
      type: Number,
      require: true,
      enum: MailLoggerEnum,
      default: MailLoggerEnum.PENDING,
    },
  },
  { timestamps: true },
);
const MailLoggerModel = mongoose.model<IMailLogger & mongoose.Document>(
  'mail-log',
  MailLoggerSchema,
);
export { MailLoggerModel };
export default MailLoggerModel;
