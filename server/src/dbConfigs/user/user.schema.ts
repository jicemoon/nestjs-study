import { Schema, Types } from 'mongoose';

import { COLLECTIONS_NAME } from './../consts';

export const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  avatar: { type: Types.ObjectId, ref: COLLECTIONS_NAME.uploadFile },
  createDate: {
    type: Date,
    default: Date.now(),
  },
  updateDate: {
    type: Date,
    default: Date.now,
  },
});
