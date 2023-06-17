import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const LogINOSchema = new Schema(
  {
    code: {
      type: String,
    },
    log: [
      {
        addressUser: {
          type: String,
        },
        txnID: {
          type: String,
        },
        inviteRefCode: {
          type: String,
        },
        timestamp: {
          type: String,
        },
      },
    ],
  },
  { collection: 'LogINO' },
);
const LogInoModel = mongoose.model<mongoose.Document>('LogINO', LogINOSchema);
export { LogInoModel, LogINOSchema };
export default LogInoModel;
