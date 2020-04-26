import { Document } from 'mongoose';

import { MessageType } from '@app/chat/types/mssage-type.enum';
import { UploadFileType } from '@app/typeClass/UploadFileType';

export interface ISearchMessageParams {
  type?: MessageType;
  from: string;
  to: string;
}

export interface IMessageBase {
  type?: MessageType;
  from: string;
  to: string;
  msg: string;
  createDate: string;
  token?: number;
}
export interface IMessageFile extends IMessageBase {
  files: UploadFileType[];
}
export interface IMessage extends IMessageBase {
  files: string[];
}
export interface IMessageDoc extends IMessage, Document {}
