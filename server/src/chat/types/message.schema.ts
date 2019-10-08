import { Schema } from 'mongoose';

export const MessageSchema = new Schema({
  from: Schema.Types.ObjectId,
  to: Schema.Types.ObjectId,
  type: Number,
  msg: String,
  createDate: String,
});
