import mongoose from 'mongoose';
import { IUser } from './user.interface';
import { UserStatusEnum } from '@models/enums/user.status';
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: false,
      unique: false,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Please enter an email'],
    },
    address: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    status: {
      type: Number,
      require: true,
      enum: UserStatusEnum,
      default: UserStatusEnum.WAITING,
    },
  },
  { timestamps: true },
);
const UserModel = mongoose.model<IUser & mongoose.Document>('user', UserSchema);
export { UserModel };
export default UserModel;
