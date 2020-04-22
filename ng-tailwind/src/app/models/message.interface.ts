import { IFileInfo } from './fileinfo.interface';
import { IUserInfo } from '@app/models/userinfo.interface';

export interface IMsg {
  from: string;
  to: string;
  msg?: string;
  createDate?: string;
  files?: IFileInfo[];
  token?: number;
}
export interface MsgItem extends IMsg {
  loading: boolean;
  isSelf: boolean;
  userInfo: IUserInfo;
}
