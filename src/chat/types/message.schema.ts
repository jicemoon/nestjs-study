import { Schema } from 'mongoose';

export const MessageSchema = new Schema({
  from: String,
  to: String,
  msg: String,
  createDate: String,
});
