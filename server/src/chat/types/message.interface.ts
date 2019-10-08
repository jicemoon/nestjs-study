import { Document } from 'mongoose';

import { UserInfo } from '../../user/types/user-info';

export interface ISearchMessageParams {
  from: UserInfo;
  to: UserInfo;
}

export interface IMessage {
  from: string;
  to: string;
  msg: string;
  createDate: string;
  token?: number;
}
export interface IMessageDoc extends IMessage, Document {}
