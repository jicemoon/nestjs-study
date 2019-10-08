import { UserInfo } from '@app/user/types/user-info';

import { IMessage, IMessageDoc } from './message.interface';
import { MessageType } from './mssage-type.enum';

export class Message implements IMessage {
  type: MessageType;
  id: string;
  from: string;
  to: string;
  msg: string;
  token?: number;
  createDate: string;
  userInfo: UserInfo;
  constructor(msg: IMessageDoc, userInfo?: UserInfo, token?: number) {
    this.type = msg.type;
    this.id = msg.id;
    this.from = msg.from;
    this.to = msg.to;
    this.msg = msg.msg;
    this.createDate = msg.createDate;
    this.token = token;
    this.userInfo = userInfo;
  }
}
