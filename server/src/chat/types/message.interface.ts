import { Document } from 'mongoose';

import { MessageType } from '@app/chat/types/mssage-type.enum';
import { UserInfo } from '@app/user/types/user-info';

export interface ISearchMessageParams {
  from: UserInfo;
  to: UserInfo;
  type: MessageType;
}

export interface IMessage {
  type: MessageType;
  from: string;
  to: string;
  msg: string;
  createDate: string;
  token?: number;
}
export interface IMessageDoc extends IMessage, Document {}
