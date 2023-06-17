import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const AccountINOSchema = new Schema(
  {
    address: {
      type: String,
    },
    referalCode: {
      type: String,
    },
    abc: {
      type: Number,
    },
  },
  { collection: 'AccountINO' },
);
const AccountInoModel = mongoose.model<mongoose.Document>(
  'AccountINO',
  AccountINOSchema,
);
export { AccountInoModel, AccountINOSchema };
export default AccountInoModel;
