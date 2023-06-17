// import { IPoolINO } from './pool-ino.interface';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PoolINOSchema = new Schema(
  {
    address: {
      type: String,
      required: [true, 'Please enter an address contract'],
      unique: true,
    },
    project: {
      type: String,
      required: [true, 'Please enter an project_code'],
      unique: true,
    },
    whitelist: {
      type: Number,
      required: false,
      unique: false,
    },

    public: {
      type: Number,
      required: false,
      unique: false,
    },
    private: {
      type: Number,
      required: false,
      unique: false,
    },
    holder: {
      type: Number,
      required: false,
      unique: false,
    },
    whitelistInfo: {
      type: Array,
      required: false,
      unique: false,
    },
    privateInfo: {
      type: Array,
      required: false,
      unique: false,
    },
    holderInfo: {
      type: Array,
      required: false,
      unique: false,
    },
  },
  {
    collection: 'PoolINO',
  },
);
const PoolINOModel = mongoose.model<mongoose.Document>(
  'PoolINO',
  PoolINOSchema,
);
export { PoolINOModel };
export default PoolINOModel;
