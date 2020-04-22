import { Schema } from 'mongoose';

export const UploadFileSchema = new Schema({
  uri: Schema.Types.String,
  originalname: Schema.Types.String,
  encoding: Schema.Types.String,
  mimetype: Schema.Types.String,
  size: Schema.Types.Number,
  createDate: Schema.Types.Date,
});

export const MessageSchema = new Schema({
  from: Schema.Types.ObjectId,
  to: Schema.Types.ObjectId,
  type: Number,
  msg: String,
  createDate: String,
  files: Schema.Types.Array,
});
