import { IUserInfo } from '@app/models/userinfo.interface';
import { MessageType } from '@app/models/message-type.enum';

export enum SocketEventType {
  login = 'login',
  msgToServer = 'msgToServer',
  msgToClient = 'msgToClient',
}
export interface IMsg {
  type: MessageType;
  from: string;
  to: string;
  msg: string;
  createDate?: string;
  token?: number;
}
export interface MsgItem extends IMsg {
  loading: boolean;
  isSelf: boolean;
  userInfo: IUserInfo;
}
