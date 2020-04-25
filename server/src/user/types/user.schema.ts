import { Schema, Types } from 'mongoose';

export const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  avatar: { type: Types.ObjectId, ref: 'UploadFile' },
  createDate: {
    type: Date,
    default: Date.now(),
  },
  updateDate: {
    type: Date,
    default: Date.now,
  },
});
