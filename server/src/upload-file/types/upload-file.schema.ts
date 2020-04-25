import { Schema } from 'mongoose';

export const UploadFileSchema = new Schema({
  uri: Schema.Types.String,
  originalname: Schema.Types.String,
  encoding: Schema.Types.String,
  mimetype: Schema.Types.String,
  size: Schema.Types.Number,
  useType: Schema.Types.String,
  width: Schema.Types.Number,
  height: Schema.Types.Number,
  ext: Schema.Types.String,
  createDate: Schema.Types.Date,
});
