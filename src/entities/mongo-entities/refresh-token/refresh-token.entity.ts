import mongoose from 'mongoose';
import { IRefreshToken } from './refresh-token.interface';
const Schema = mongoose.Schema;

const RefreshTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    TTL: {
      type: Number,
      unique: false,
      required: true,
    },
    authenticationId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
const RefreshTokenModel = mongoose.model<IRefreshToken & mongoose.Document>(
  'refresh-token',
  RefreshTokenSchema,
);
export { RefreshTokenModel };
export default RefreshTokenModel;
