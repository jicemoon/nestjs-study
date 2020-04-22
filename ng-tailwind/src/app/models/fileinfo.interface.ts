import { Observable } from 'rxjs';

export interface IFileInfo {
  uri?: string;
  $uri?: Observable<string>;
  originalname: string;
  /** 文件编码类型 */
  encoding?: string;
  /** 文件MIME 类型 */
  mimetype: string;
  /** 文件 */
  buffer?: File;
  size?: number;
}
