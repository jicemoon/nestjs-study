import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { IUploadFileDoc, IUploadFile } from './types/upload-file.interface';
import { UploadFile } from './types/upload-file.model';
import { uploadImageFiles, getImageSize } from '@app/shared/utils';
import { UploadFileType } from '@app/typeClass/UploadFileType';
import { FileTypeKeys } from '@app/configs';

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
  async saveUploadFile(file: UploadFileType, type: FileTypeKeys = FileTypeKeys.chat): Promise<UploadFile> {
    const fileInfo = await uploadImageFiles(file, type);
    const size = await getImageSize(file.buffer);
    const fileDto: IUploadFile = {
      uri: fileInfo.filePath,
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      type: type.toString(),
      size: file.size,
      width: size.width,
      height: size.height,
      ext: size.type,
      createDate: new Date(),
    };
    const createFile = new this.uploadFileModel(fileDto);
    const fileDoc = await createFile.save();
    const rtnFile = new UploadFile(fileDoc, true);

    return rtnFile;
  }
}
