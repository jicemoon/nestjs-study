import { Document } from 'mongoose';

export interface IUploadFile {
  uri?: string;
  originalname?: string;
  encoding?: string;
  mimetype: string;
  type?: string;
  size?: number;
  width?: number;
  height?: number;
  ext?: string;
  createDate?: Date;
}
export interface IUploadFileDoc extends IUploadFile, Document {}
