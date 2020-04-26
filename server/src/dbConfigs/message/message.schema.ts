import { Schema } from 'mongoose';
import { COLLECTIONS_NAME } from './../consts';

export const MessageSchema = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: COLLECTIONS_NAME.user,
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: COLLECTIONS_NAME.user,
  },
  type: Number,
  msg: String,
  createDate: String,
  files: {
    type: Schema.Types.Array,
    ref: COLLECTIONS_NAME.uploadFile,
  },
});
