import { Document } from 'mongoose';

export interface IUploadFile {
  uri?: string;
  originalname?: string;
  encoding?: string;
  mimetype: string;
  size?: number;
  width?: number;
  height?: number;
  ext?: string;
  useType?: string;
  createDate?: Date;
}
export interface IUploadFileDoc extends IUploadFile, Document {}
