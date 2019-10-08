import { Document } from 'mongoose';

export interface BaseUser {
  name?: string;
  password?: string;
}
export interface User extends BaseUser {
  email: string;
  token?: string;
  avatar?: string;
  createDate?: Date;
  updateDate?: Date;
}
export interface UserDoc extends User, Document {}
