import { writeFile, existsSync, mkdir } from 'promise-fs';
import { createHash } from 'crypto';
import { FileTypeKeys, UPLOAD_FOLDER } from '@app/configs';
import { UploadFileType } from '@app/typeClass/UploadFileType';
import { FileInfo } from '@app/user/types/fileinfo';
import { parse } from 'path';

export function sha256(data) {
  return createHash('sha256')
    .update(data)
    .digest('hex');
}
export async function uploadImageFiles(file: UploadFileType, mineType: FileTypeKeys): Promise<FileInfo> {
  const { ext, name, base } = parse(file.originalname || '');
  const filePath = `${UPLOAD_FOLDER.images}/${mineType}`;
  const fullPath = `${UPLOAD_FOLDER.root}/${filePath}`;
  let fileName = sha256(base) + ext;
  let fullFilePath = `${fullPath}/${fileName}`;
  if (!existsSync(fullPath)) {
    await mkdir(fullPath, { recursive: true });
  }
  for (let i = 0; i < 20 && existsSync(fullFilePath); i++) {
    const random = Math.floor((100000 + i * 10000) * Math.random());
    let fillChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    if (Math.random() >= 0.5) {
      fillChar = fillChar.toLowerCase();
    }
    fileName = sha256(`${name}${('' + random).padStart(6, fillChar)}${ext}`);
    fullFilePath = `${fullPath}/${fileName}${ext}`;
  }
  await writeFile(fullFilePath, file.buffer);
  return new FileInfo(`${filePath}/${fileName}`);
}
export function getPersonalRoomID(from: string, to: string) {
  return [from, to].sort((a, b) => (a > b ? 1 : -1)).join('_');
}
