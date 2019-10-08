import { UPLOAD_FOLDER } from '../../configs/const.define';

export class FileInfo {
  constructor(public filePath: string = '', public fileUri: string = UPLOAD_FOLDER.uri) {}
}
