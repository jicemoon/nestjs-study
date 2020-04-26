import { UserInfo } from '@app/user/types/user-info';

import { IMessageDoc, IMessageBase } from '../../dbConfigs/message/message.doc';
import { MessageType } from './mssage-type.enum';
import { UploadFile } from '@app/upload-file/types/upload-file.model';

export class Message implements IMessageBase {
  type: MessageType;
  id: string;
  from: string;
  to: string;
  msg: string;
  token?: number;
  createDate: string;
  files: UploadFile[];
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
