import { Document } from 'mongoose';

export interface IUploadFile {
  uri?: string;
  originalname?: string;
  encoding?: string;
  mimetype: string;
  size?: number;
  createDate?: Date;
}
export interface IUploadFileDoc extends IUploadFile, Document {}
