import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { IUploadFileDoc } from './types/upload-file.interface';
import { InjectModel } from '@nestjs/mongoose';
import { uploadImageFiles } from '@app/shared/utils';
import { UploadFileType } from '@app/typeClass/UploadFileType';
import { FileTypeKeys } from '@app/configs';
import { UploadFile } from './types/upload-file.model';
import { FileInfo } from '@app/user/types/fileinfo';

@Injectable()
export class UploadFileService {
  constructor(@InjectModel('UploadFile') private readonly uploadFileModel: Model<IUploadFileDoc>) {}

  async getUploadFileByIDs(ids: string[]): Promise<UploadFile[]> {
    const fileDocs = await this.uploadFileModel.find({ _id: { $in: ids } }).exec();
    return fileDocs.map(f => {
      return new UploadFile(f, true);
    });
  }
  async getUploadFileByID(id: string): Promise<UploadFile> {
    const fileDoc = await this.uploadFileModel.findById(id);
    return new UploadFile(fileDoc, true);
  }
  async saveUploadFile(file: UploadFileType): Promise<UploadFile> {
    const fileInfo = await uploadImageFiles(file, FileTypeKeys.chat);
    const createFile = new this.uploadFileModel({
      uri: fileInfo.filePath,
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      size: file.size,
      createDate: new Date(),
    });
    const fileDoc = await createFile.save();
    const rtnFile = new UploadFile(fileDoc);
    rtnFile.uri = fileInfo.fullPath;

    return rtnFile;
  }
}
