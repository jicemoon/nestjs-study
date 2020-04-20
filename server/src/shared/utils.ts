import { writeFile, existsSync, mkdir } from 'promise-fs';
import { createHash } from 'crypto';
import { FileTypeKeys, UPLOAD_FOLDER } from '@app/configs';
import { UploadFileType } from '@app/typeClass/UploadFileType';
import { FileInfo } from '@app/user/types/fileinfo';

export function sha256(data) {
  return createHash('sha256')
    .update(data)
    .digest('hex');
}
export async function uploadImageFiles(file: UploadFileType, mineType: FileTypeKeys): Promise<FileInfo> {
  const names: string[] = (file.originalname || '').split('.');
  const ext = names.pop();
  const fileName = sha256(names.join('.') || '') + '.' + ext;
  const filePath = `${UPLOAD_FOLDER.images}/${UPLOAD_FOLDER.avatar}/`;
  const fullPath = `${UPLOAD_FOLDER.root}/${filePath}`;
  if (!existsSync(fullPath)) {
    await mkdir(fullPath, { recursive: true });
  }
  await writeFile(`${fullPath}/${fileName}`, file.buffer);
  return new FileInfo(`${filePath}/${fileName}`);
}
export function getPersonalRoomID(from: string, to: string) {
  return [from, to].sort((a, b) => (a > b ? 1 : -1)).join('_');
}
