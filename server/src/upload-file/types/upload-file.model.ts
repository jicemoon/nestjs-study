import { MyDate } from '@app/extends/Date.extends';
import { IUploadFile, IUploadFileDoc } from '../../dbConfigs/uploadFile/upload-file.doc';
import { FileInfo } from '@app/upload-file/types/fileinfo';
import { FileMineKeys } from '@app/configs';

export class UploadFile implements IUploadFile {
  id: string;
  uri: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  useType: FileMineKeys;
  width: number;
  height: number;
  ext: string;
  createDateStr: string;
  constructor(file: IUploadFileDoc, isFullUri: boolean = false) {
    this.id = file.id;
    this.uri = file.uri;
    if (isFullUri) {
      this.uri = new FileInfo(file.uri).fullPath;
    }
    this.originalname = file.originalname;
    this.encoding = file.encoding;
    this.mimetype = file.mimetype;
    this.useType = file.useType as FileMineKeys;
    this.size = file.size;
    this.width = file.width;
    this.height = file.height;
    this.ext = file.ext;
    this.createDateStr = new MyDate(file.createDate).format();
  }
}
