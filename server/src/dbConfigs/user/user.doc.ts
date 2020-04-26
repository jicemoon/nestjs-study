import { Document } from 'mongoose';
import { IUploadFileDoc } from '@app/dbConfigs/uploadFile/upload-file.doc';

export interface BaseUser {
  name?: string;
  password?: string;
}
export interface User extends BaseUser {
  email: string;
  token?: string;
  avatar?: string | IUploadFileDoc;
  createDate?: Date;
  updateDate?: Date;
}
export interface UserDoc extends User, Document {}
