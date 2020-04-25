import { UPLOAD_FOLDER } from '@app/configs/const.define';

export class FileInfo {
  /**
   * 上传文件相对路径
   * @type {string}
   * @memberof FileInfo
   */
  public filePath: string;
  /**
   * 静态文件域名跟目录
   * @type {string}
   * @memberof FileInfo
   */
  public fileUri: string;
  constructor(filePath: string = '', fileUri: string = UPLOAD_FOLDER.uri) {
    this.filePath = filePath;
    this.fileUri = fileUri;
  }
  /**
   * 包括静态域名的文件完整路径
   * @readonly
   * @type {string}
   * @memberof FileInfo
   */
  get fullPath(): string {
    let dash = '/';
    if (/\/$/.test(this.fileUri) || /^\//.test(this.filePath)) {
      dash = '';
    }
    return `${this.fileUri}${dash}${this.filePath}`;
  }
}
